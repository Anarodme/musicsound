import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './Components/login/login.component';
import { AlbumComponent } from './Components/album/album.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { RecordPodcastComponent } from './Components/record-podcast/record-podcast.component';
import { MusicComponent } from './Components/library/favorites/music/music.component';
import { InformationComponent } from './Components/information/information.component';
import { PlanComponent } from './Components/plan-offer/plan/plan.component';
import { EpisodesComponent } from './Components/categories-podcast/podcast/episodes/episodes.component';
import { PodcastComponent } from './Components/categories-podcast/podcast/podcast.component';
import { CategoriesPodcastComponent } from './Components/categories-podcast/categories-podcast.component';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import { SongsPlaylistComponent } from './Components/playlist/songs-playlist/songs-playlist.component';
import { EditPodcastComponent } from './Components/edit-podcast/edit-podcast.component';
import { CategorieComponent } from './Components/podcast/categorie/categorie.component';
import { MusicPlayerComponent } from './Components/music-player/music-player.component';
import { SongsComponent } from './Components/album/songs/songs.component';
import { LibraryComponent } from './Components/library/library.component';
import { ChangePasswordComponent } from './Components/login/change-password/change-password.component';
import { LiveStreamingComponent } from './Components/record-podcast/live-streaming/live-streaming.component';
import { ValidIdGuard } from './Components/edit-podcast/Valid-ID-Guard';
import { PlayerControlsComponent } from './Components/player-controls/player-controls.component';
import { ModalPlaylistsComponent } from './Components/album/songs/modal-playlists/modal-playlists.component';
import { FavoritesComponent } from './Components/library/favorites/favorites.component';
import { PaymentWindowComponent } from './Components/plan-offer/payment-window/payment-window.component';
import { PlanOfferComponent } from './Components/plan-offer/plan-offer.component';

const routes : Routes = [
  { path: '', component: HomePageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'editProfile', component: EditProfileComponent },
  { path: 'editPodcast/:id', component: EditPodcastComponent,canActivate: [ValidIdGuard]},
  { path: 'album', component: AlbumComponent },
  { path: 'recordPodcast', component: RecordPodcastComponent },
  //{ path: 'categoriesPodcast', component: CategorieComponent },
  { path: 'music', component: MusicComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'playlist/:libraryId', component: PlaylistComponent },
  { path: 'information', component: InformationComponent },
  { path: 'categories', component: CategoriesPodcastComponent },
  { path: 'pago', component: PaymentWindowComponent },
  //{ path: 'episodes', component: EpisodesComponent},
  { path: 'music-player', component: MusicPlayerComponent },
  { path: 'album/:artistId', component: AlbumComponent },
  { path: 'album/:albumId/songs', component: SongsComponent },
  { path: 'podcast/:categoryId', component: PodcastComponent },
  { path: 'cambiar-contraseña', component: ChangePasswordComponent},
  { path: 'podcast/:podcastId/episodes', component: EpisodesComponent },
  { path: 'playlist/:playlistId/songs', component: SongsPlaylistComponent },
  { path: 'liveStreaming', component: LiveStreamingComponent},
  { path: 'favorites/:libraryId', component: FavoritesComponent},
  { path: 'plans', component: PlanOfferComponent},



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
