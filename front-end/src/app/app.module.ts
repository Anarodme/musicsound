import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { CategoriesPodcastComponent } from './Components/categories-podcast/categories-podcast.component';
import { PodcastComponent } from './Components/categories-podcast/podcast/podcast.component';
import { EpisodesComponent } from './Components/categories-podcast/podcast/episodes/episodes.component';
import { RecordPodcastComponent } from './Components/record-podcast/record-podcast.component';
import { EditPodcastComponent } from './Components/edit-podcast/edit-podcast.component';
import { ArtistComponent } from './Components/artist/artist.component';
import { AlbumComponent } from './Components/album/album.component';
import { SongsComponent } from './Components/album/songs/songs.component';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import { LibraryComponent } from './Components/library/library.component';
import { FavoritesComponent } from './Components/library/favorites/favorites.component';
import { MusicComponent } from './Components/library/favorites/music/music.component';
import { MusicPlayerComponent } from './Components/music-player/music-player.component';
import { PlanOfferComponent } from './Components/plan-offer/plan-offer.component';
import { PlanComponent } from './Components/plan-offer/plan/plan.component';
import { PaymentWindowComponent } from './Components/plan-offer/payment-window/payment-window.component';
import { HeaderComponent } from './Components/header/header.component';
import { InformationComponent } from './Components/information/information.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './Services/user.service';
import { DropdownDirective } from './Components/header/dropdown.directive';
import { AuthenticatedComponent } from './Components/header/authenticated/authenticated.component';
import { NotAuthenticatedComponent } from './Components/header/notAuthenticated/notAuthenticated.component';
import { DynamicComponentDirective } from './Components/header/auth.directive';
import { DefaultComponent } from './Components/header/default/default.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ChangePasswordComponent } from './Components/login/change-password/change-password.component';
import { PlayerControlsComponent } from './Components/player-controls/player-controls.component';
import { SongsPlaylistComponent } from './Components/playlist/songs-playlist/songs-playlist.component';
import { LiveStreamingComponent } from './Components/record-podcast/live-streaming/live-streaming.component';
import { ModalPlaylistsComponent } from './Components/album/songs/modal-playlists/modal-playlists.component';
import { ModalPlaylistEditComponent } from './Components/playlist/modal-playlist-edit/modal-playlist-edit.component';
import { FooterComponent } from './Components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomePageComponent,
    EditProfileComponent,
    EpisodesComponent,
    PodcastComponent,
    CategoriesPodcastComponent,
    RecordPodcastComponent,
    EditPodcastComponent,
    ArtistComponent,
    AlbumComponent,
    PlaylistComponent,
    LibraryComponent,
    FavoritesComponent,
    MusicComponent,
    MusicPlayerComponent,
    PlanOfferComponent,
    PlanComponent,
    PaymentWindowComponent,
    HeaderComponent,
    InformationComponent,
    DropdownDirective,
    AuthenticatedComponent,
    NotAuthenticatedComponent,
    DynamicComponentDirective,
    DefaultComponent,
    SongsComponent,
    ChangePasswordComponent,
    PlayerControlsComponent,
    SongsPlaylistComponent,
    LiveStreamingComponent,
    ModalPlaylistsComponent,
    ModalPlaylistEditComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule

  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
