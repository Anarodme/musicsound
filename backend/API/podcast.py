from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from django.conf import settings
import requests 
import xml.etree.ElementTree as ET
import sounddevice as sd
import numpy as np
import soundfile as sf
import base64
import socket
import lameenc
import threading
import wave
import os

active_stream = None

def set_active_stream(stream):
    global active_stream
    active_stream = stream

def get_active_stream():
    return active_stream

class LiveStream:
    def __init__(self, mountpoint, name_stream, descrip_stream, genre_stream, device_index, device_channels, output_filename):
        self.server = settings.ICECAST_SERVER
        self.port = settings.ICECAST_PORT
        self.username = settings.ICECAST_USERNAME
        self.password = settings.ICECAST_PASSWORD
        self.mountpoint = mountpoint
        self.name_stream = name_stream
        self.descrip_stream = descrip_stream
        self.genre_stream = genre_stream
        self.device_index = device_index
        self.device_channels = device_channels
        self.output_filename = output_filename
        self.output_file = None
        self.sock = None
        self.encoder = None
        self.control_thread = None
        self.transmitir_thread = None
        self.audio_data = None
        self.sample_rate = None
        self.mic_activado = False
        self.musica_activada = False
        self.stop_broadcast = False

    def verificar_conexion_servidor(self):
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.settimeout(3)  # Establece un tiempo de espera de 3 segundos
            self.sock.connect((self.server, self.port))
            self.sock.close()
            return True, None
        except Exception as e:
            return False, str(e)
        
    def check_audio_devices(self):
        try:
            with sd.InputStream( dtype='float32', device=self.device_index, channels=self.device_channels, samplerate=44100):
                return True, str('Ok')
        except Exception as e:
            return False, str(e)
        
    def check_sample_rate(self):
        try:
            # Verificar si la frecuencia de muestreo es 44100 Hz
            if self.sample_rate == 44100:
                return True, None
            else:
                return False, f"La frecuencia de muestreo es {self.sample_rate} Hz, se requiere 44100 Hz."
        except Exception as e:
            return False, str(e)
        
    def send_headers(self, sock):
        auth_header = f"Authorization: Basic {base64.b64encode(f'{self.username}:{self.password}'.encode()).decode()}\r\n"
        content_type_header = "Content-Type: audio/mpeg\r\n"
        icy_metadata_header = "Icy-Metadata: 1\r\n"
        connection_header = "Connection: close\r\n\r\n"
        source_command = f"SOURCE {self.mountpoint} ICE/1.0\r\n"
        ice_name_header = f"Ice-Name: {self.name_stream}\r\n"
        ice_description_header = f"Ice-Description: {self.descrip_stream}\r\n"
        ice_genre_header = f"Ice-Genre: {self.genre_stream}\r\n"
        
        headers = source_command + auth_header + content_type_header + icy_metadata_header + ice_name_header + ice_description_header + ice_genre_header + connection_header
        sock.sendall(headers.encode())
    
    def transmitir_audio(self):
        def callback(indata, frames, time, status):
            if self.mic_activado and not self.musica_activada:
                pcm_data = (np.iinfo(np.int16).max * indata).astype(np.int16)
                mp3_data = self.encoder.encode(pcm_data.tobytes())
                self.sock.sendall(mp3_data)
                self.output_file.writeframes(pcm_data.tobytes())
            else:
                if not self.mic_activado and self.musica_activada:
                    try:
                        if self.sample_rate != 44100:
                            raise ValueError("La canción no está en 44100 Hz.")

                        start_index = callback.current_index
                        end_index = min(callback.current_index + frames, len(self.audio_data))
                        audio_fragment = self.audio_data[start_index:end_index]

                        if end_index == len(self.audio_data):
                            callback.current_index = 0
                            self.musica_activada = False
                        else:
                            callback.current_index = end_index

                        pcm_data = (np.iinfo(np.int16).max * audio_fragment).astype(np.int16)
                        mp3_data = self.encoder.encode(pcm_data.tobytes())
                        self.sock.sendall(mp3_data)
                        self.output_file.writeframes(pcm_data.tobytes())

                    except ValueError as e:
                        print(f"Error: {e}")
                        self.musica_activada = False
                else:
                    # Si el micrófono está apagado, generamos un segmento de datos de audio en silencio
                    silence_data = np.zeros_like(indata)
                    mp3_data = self.encoder.encode((np.iinfo(np.int16).max * silence_data).astype(np.int16).tobytes())
                    self.sock.sendall(mp3_data)
                    self.output_file.writeframes(silence_data.tobytes())

        callback.current_index = 0

        with sd.InputStream(callback=callback, dtype='float32', device=self.device_index, channels=self.device_channels, samplerate=44100):
            print('\nTransmitiendo en vivo...')
            try:
                while not self.stop_broadcast:
                    sd.sleep(1000)

            finally:
                # Cerrar el socket al finalizar la transmisión
                if self.sock:
                    try:
                        self.sock.shutdown(socket.SHUT_RDWR)
                        self.sock.close()
                    except OSError as e:
                        print(f"Error al cerrar el socket: {e}")
                        
    def controlar_estado(self, action):
        if action == 'mic_apagar':
            self.mic_activado = False
            self.musica_activada = False
            print("Micrófono apagado.")

        elif action == 'mic_encender':
            self.mic_activado = True
            self.musica_activada = False
            print("Micrófono encendido.")

        elif action == 'music_start':
            self.mic_activado = False
            self.musica_activada = True
            print("Musica encendido.")

        elif action == 'music_stop':
            self.mic_activado = False
            self.musica_activada = False
            print("Musica apagado.")

    def transmitir_en_vivo(self):
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.connect((self.server, self.port))
            self.send_headers(self.sock)

            self.encoder = lameenc.Encoder()
            self.encoder.set_channels(self.device_channels)
            self.encoder.set_bit_rate(128)
            self.encoder.set_in_sample_rate(44100)
            self.encoder.set_quality(2)

            # Crear archivo WAV para grabar la transmisión
            self.output_file = wave.open(self.output_filename, 'wb')
            self.output_file.setnchannels(self.device_channels)
            self.output_file.setsampwidth(2)
            self.output_file.setframerate(44100)

            # Iniciar hilo para controlar el estado
            self.control_thread = threading.Thread(target=self.controlar_estado, args=('mic_apagar',), daemon=True)
            self.control_thread.start()

            # Transmitir audio en un hilo separado
            self.transmitir_thread = threading.Thread(target=self.transmitir_audio, daemon=True)
            self.transmitir_thread.start()

            # Esperar a que ambos hilos finalicen
            self.transmitir_thread.join()
            self.control_thread.join()

            # Cerrar archivo WAV
            self.output_file.close()
        
        except Exception as e:
            return  print(f'Error: {e}')
        
        finally:
            if self.sock:
                self.sock.close()

    def stop_transmission(self):
        try:
            # Establecer la bandera para detener la transmisión
            self.mic_activado = False
            self.musica_activada = False
            self.stop_broadcast = True
        
            # Aquí puedes agregar un mensaje de respuesta
            return {'message': 'Transmisión detenida correctamente'}, 200
        except Exception as e:
            # Manejar cualquier error que pueda ocurrir durante el proceso de detención de la transmisión
            return {'error': str(e)}, 500


#Datos del stream
punto_de_montaje = "/live"
genre_stream = "variado"

def get_streams_icecast(url_status):
    try:
        response = requests.get(url_status)
        response.raise_for_status()  # Lanza una excepción si hay un error HTTP
        icecast_data = response.json()  # Analiza directamente el JSON de la respuesta
        return icecast_data
    except requests.RequestException as e:
        raise  # Re-lanzar la excepción para manejarla en la vista principal
    except Exception as e:
        print(f"Error al obtener el estado del servidor Icecast: {e}")
        return {}


#APIS

@api_view(['GET'])
def check_audio_devices(request):
    if request.method == 'GET':
        all_devices = sd.query_devices()
        connected_input_devices = [device for device in all_devices if device['max_input_channels'] > 0 and device['hostapi'] != -1]
        if not connected_input_devices:
            return Response({"message": "No se encontraron dispositivos de audio disponibles."}, status=404)
        else:
            devices_info = [{"id": i, "name": device['name'], "max_input_channels": device['max_input_channels']} for i, device in enumerate(connected_input_devices)]
            return Response({"message": "Dispositivos de entrada de audio disponibles:", "devices": devices_info}, status=200)
        
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def listeners(request):
    try:
        url_status_icecast = 'http://' + settings.ICECAST_SERVER + ':' + str(settings.ICECAST_PORT) + '/status-json.xsl'
        streams_activos = get_streams_icecast(url_status_icecast)
        return Response(streams_activos, status=200)
    except requests.RequestException as e:
        return Response({"error": f"Error al realizar la solicitud HTTP: {e}"}, status=500)
    except ET.ParseError as e:
        return Response({"error": f"Error al analizar los datos XML del servidor Icecast: {e}"}, status=500)
    except Exception as e:
        return Response({"error": f"Error inesperado: {e}"}, status=500)
    
output_filename = "E:/Projects/MusicSound/test/records/transmision_grabada.wav"


@api_view(['POST'])
def checkbroadcast(request):
    data = request.data
    name_stream = data.get('episodename')
    descrip_stream = data.get('episodedescription')
    device_index = data.get('deviceId')
    device_channels = data.get('maxChannels')

    if request.method == 'POST':
        # Iniciar la transmisión en vivo
        stream = LiveStream(punto_de_montaje, name_stream, descrip_stream, genre_stream, device_index, device_channels, output_filename)
        successSever, error_messageServer = stream.verificar_conexion_servidor()
        if successSever:
            successAudio, error_messageAudio = stream.check_audio_devices()
            if successAudio:
                return Response({'message': successAudio}, status=status.HTTP_200_OK)
            else:
                return Response({'error': error_messageAudio}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        else:
            return Response({'error': error_messageServer}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # Si llegamos aquí, significa que el método de solicitud no es POST
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def startbroadcast(request):
    if request.method == 'POST':
        data = request.data
        name_stream = data.get('episodename')
        descrip_stream = data.get('episodedescription')
        device_index = data.get('deviceId')
        device_channels = data.get('maxChannels')

        if get_active_stream():
            # Si hay una transmisión en curso, devuelve un mensaje de error
            return Response({'error': 'Ya hay una transmisión en curso. Detén la transmisión actual antes de iniciar una nueva transmisión'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Si no hay transmisión en curso, inicia una nueva transmisión
        stream = LiveStream(punto_de_montaje, name_stream, descrip_stream, genre_stream, device_index, device_channels, output_filename)
        set_active_stream(stream)
        stream.transmitir_en_vivo()

        # Retorna una respuesta de éxito después de iniciar la transmisión
        return Response({'message': 'Transmisión iniciada correctamente'}, status=status.HTTP_200_OK)

    # Si llegamos aquí, significa que el método de solicitud no es POST
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@api_view(['POST'])
def microphone_control(request):
    if request.method == 'POST':
        stream = get_active_stream()  # Implementa esta función para obtener la instancia de LiveStream actual

        # Verificar si la acción es válida
        if stream:
            if stream.mic_activado == True:
                stream.controlar_estado('mic_apagar')
                return Response({'message': 'Musica mic_apagar correctamente'}, status=status.HTTP_200_OK)
            else:
                stream.controlar_estado('mic_encender')
                return Response({'message':'Musica mic_encender correctamente'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No hay transmisión en curso'}, status=status.HTTP_404_NOT_FOUND)
        
    # Si llegamos aquí, significa que el método de solicitud no es POST
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def music_control(request):
    if request.method == 'POST':
        stream = get_active_stream()  # Implementa esta función para obtener la instancia de LiveStream actual
        
        # Verificar si la acción es válida
        if stream:
            if stream.musica_activada == True:
                stream.controlar_estado('music_stop')
                return Response({'message': 'Musica music_stop correctamente'}, status=status.HTTP_200_OK)
            else:
                stream.controlar_estado('music_start')
                return Response({'message': 'Musica music_start correctamente'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No hay transmisión en curso'}, status=status.HTTP_404_NOT_FOUND)
        
    # Si llegamos aquí, significa que el método de solicitud no es POST
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def stopbroadcast(request):
    if request.method == 'POST':
        # Obtener la instancia de LiveStream
        stream = get_active_stream()  # Implementa esta función para obtener la instancia de LiveStream actual
        if stream:
            # Detener la transmisión
            print("Detener la transmisión")
            stream.stop_transmission()
            set_active_stream(None)
            return Response({'message': 'Transmisión detenida correctamente'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No hay transmisión en curso'}, status=status.HTTP_404_NOT_FOUND)
        
    # Si llegamos aquí, significa que el método de solicitud no es POST
    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def uploadMusic(request):
    if request.method == 'POST':
        audio_file = request.FILES.get('file')  # Obtener el archivo de la solicitud
        if not audio_file:
             return Response({'error': 'No se proporcionó ningún archivo MP3'}, status=status.HTTP_400_BAD_REQUEST)
        
        stream = get_active_stream()  # Implementa esta función para obtener la instancia de LiveStream actual
        if stream:
            # Leer los datos del archivo de audio y almacenarlos en la instancia de LiveStream
            try:
                audio_data, sample_rate = sf.read(audio_file)
                stream.audio_data = audio_data
                stream.sample_rate = sample_rate
            except Exception as e:
                return Response({'error': f'Error al leer el archivo de audio: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            #Verificar la frecuencia de muestreo del archivo de audio
            success, message = stream.check_sample_rate()
            if success:
                return Response({'message': 'Frecuencia de muestreo compatible. Archivo de música cargado correctamente'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'No hay transmisión en curso'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)