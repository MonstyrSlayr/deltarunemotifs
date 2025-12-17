# Welcome to Deltarune Motifs
if you have any questions that are uncovered or unclear dm me on discord

## Running Locally
1. Download Git on your machine
1. Clone this repository using `git clone`
1. Download Visual Studio Code and open the local repo
1. Install the Live Server extension in VS Code
1. Click the "Go Live" button in the bottom right

## Contributing
1. Create a fork of this repository on GitHub
1. Clone the fork locally using `git clone`
1. Make cool changes to your fork
1. Add and commit your changes locally using `git add` and `git commit`
1. Push your changes to the remote repository with `git push`
1. Open a pull request on github with your changes

if you're a wee github supernerd, make sure to make your changes outside of the main branch

### Directory and figuring stuff out
#### Data Files
- **data.js** - general variables and functions
- **motifData.js** - data on leitmotifs
- **songData.js** - data on songs
- **effectData.js** - data on song effects, like the flashes and motif floating
- **contribData.js** - data on contributors

#### Site Building Files
- **motifs.json** - motifs as a json file
- **songs.json** - songs as a json file
- **make_static_site.py** - builds the site using the json files. update the site using the "Download Objects" button on your locally running copy of the website. **the website will not add your song unless you update these json files and run this python file**

#### Other
- **dynamic.js** - updates the footer on all subsites (do not change)

### Adding Songs
run the site locally

then just copy the format of the songs i've put i guess (in songData.js)

make sure to put the song in the correct place according to soundtrack order

make sure to use the correct video id (use the id of the video from the official soundtrack please)

make sure to add yourself as a contributor (under all the other contributors)

adding the song in songData.js will add the song's button to the website, but it will lead to a page that does not exist

then download the objects with the big "Download Objects" button in the middle of the home page

replace motifs.json and songs.json with the downloaded files

and then run make_static_site.py (this adds the song to the website, the song's button will work at this point)

make sure all motif references are accurate. make sure to reference every motif reference (so that when you click the bar, it goes to the correct ref at the exact point it starts at)

thank you for contributing :)