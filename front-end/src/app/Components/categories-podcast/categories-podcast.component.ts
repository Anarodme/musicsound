import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PodcastServiceService } from 'src/app/Services/Podcast/podcast-service.service';

// Interface to define the structure of podcast categories
interface Categories {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-categories-podcast',
  templateUrl: './categories-podcast.component.html',
  styleUrls: ['./categories-podcast.component.css']
})
export class CategoriesPodcastComponent implements OnInit {
  categories: Categories[];  // Array to hold the list of podcast categories

  constructor(
    private router: Router,
    private categoriesPodcastService: PodcastServiceService
  ) {}

  ngOnInit(): void {
    // Fetch the list of podcast categories from the service
    this.categoriesPodcastService.GetAllPodcastCategories().subscribe(
      data => {
        this.categories = data;  // Assign fetched data to the categories array
        console.log(data)
      },
      error => {
        console.error('Error loading categories:', error);  // Log any errors that occur
      }
    );
  }

  // Method to navigate to the podcasts page filtered by a specific category
  navigateToPodcasts(categoryId: number): void {
    //this.categoriesPodcastService.toggleCategories(false);  // Update the category filter status
    this.router.navigate(['podcast', categoryId]);  // Navigate to the podcasts page with the selected category
  }
}
