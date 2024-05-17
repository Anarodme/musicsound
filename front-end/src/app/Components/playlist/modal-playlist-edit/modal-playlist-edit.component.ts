import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-playlist-edit',
  templateUrl: './modal-playlist-edit.component.html',
  styleUrls: ['./modal-playlist-edit.component.css']
})
export class ModalPlaylistEditComponent {
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveChangesEvent = new EventEmitter<{ playlistName: string, coverImage: File | null }>();

  selectedImage: File | null = null;

  constructor() { }

  closeModal() {
    this.closeModalEvent.emit();
  }

  saveChanges() {
    const updatedPlaylistName = this.modalData.playlistName;
    this.saveChangesEvent.emit({ playlistName: updatedPlaylistName, coverImage: this.selectedImage });
    this.closeModal();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.selectedImage = file;
  }
}
