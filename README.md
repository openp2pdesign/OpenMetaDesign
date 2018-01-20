# OpenMetaDesign

A platform for the collaborative design and discussion of collaborative design processes.

## Instructions

The project is structured with the help of [iron-cli](https://github.com/iron-meteor/iron-cli), but you do not need it to run the project, it's just for development.

Clone the repo:

```
git clone https://github.com/openp2pdesign/OpenMetaDesign.git
```

Enter into the project

```
cd OpenMetaDesign
cd app
```

Install dependencies:

```
meteor npm install
```

Launch the project:

```
meteor run
```

Open a browser to [http://localhost:3000/](http://localhost:3000/)


## Docker Compose
The compose file is only for production at the moment, for local development only Meteor is needed.

The key issue for using Docker is for the integration with a discussion service. The integration with Rocket.Chat is almost ready but it still has some issues, it might be replaced by Discourse (see [this compose](https://github.com/leopku/discourse-compose)).

## Research
Menichinelli, M., & Valsecchi, F. (2016). The meta-design of systems: how design, data and software enable the organizing of open, distributed, and collaborative processes. In *6th IFDP - Systems & Design: Beyond Processes and Thinking* (pp. 518–537). Valencia: Editorial Universitat Politècnica de València. [https://doi.org/10.4995/IFDP.2016.3301](https://doi.org/10.4995/IFDP.2016.3301)

## License
[AGPL](https://github.com/openp2pdesign/OpenMetaDesign/blob/master/LICENSE)
