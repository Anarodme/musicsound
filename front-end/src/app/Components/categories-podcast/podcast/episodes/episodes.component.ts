import { Component, OnInit } from '@angular/core';
import { PodcastServiceService } from 'src/app/Services/Podcast/podcast-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css']
})
export class EpisodesComponent implements OnInit {
  episodes: any;
  podcastId: number;

  constructor(
    private podcastService: PodcastServiceService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Fetch the list of episodes by podcast
    this.route.paramMap.subscribe(params => {
      this.podcastId = +params.get('podcastId');
      if (this.podcastId) {
        this.podcastService
          .getEpisodesByPodcastId(this.podcastId)
          .subscribe(data => {
            this.episodes = data;
            console.log("datos extraídos", data);
          });
      }
    });
  }
}
