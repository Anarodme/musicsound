export class Artist {
    urlCoverImage:string;
    artistName:string;
    description:string;


    constructor(urlImage:string,artistName:string,description:string){
        this.urlCoverImage = urlImage;
        this.artistName = artistName;
        this.description = description;
    }
}