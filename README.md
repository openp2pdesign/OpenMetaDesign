![app/public/logo/OMD_logo_large.svg](app/public/logo/OMD_logo_large.png)

[![DOI](https://zenodo.org/badge/91899447.svg)](https://zenodo.org/badge/latestdoi/91899447)

A platform for the collaborative design and discussion of collaborative design processes.

## Installation

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

The platform can be also launched with docker-compose.
Configure MongoDB by editing the ```docker-compose.yml``` and ```mongo/mongo-init.js``` files where

- *MONGOADMINUSERNAME* is the admin username for MongoDB
- *MONGOADMINPASSWORD* is the admin password for MongoDB

and where

- *MONGOUSERNAME* is the admin username for connecting Meteor with MongoDB
- *MONGOPASSWORD* is the admin password for connecting Meteor with MongoDB

Then launch it with:

```
docker-compose build
docker-compose up -d
```

OMD will be then live at your server IP address (port 80).

The compose file is targeted for production, for local development just Meteor is enough.

## Development

The project is structured with the help of [iron-cli](https://github.com/iron-meteor/iron-cli), but you do not need it to run the project, it's just for development.

## Research

### Previous work
Menichinelli, M. (2015). Open Meta-Design: Tools for Designing Collaborative Processes. In D. Bihanic (Ed.), *Empowering Users through Design: Interdisciplinary Studies and Combined Approaches for Technological Products and Services* (pp. 193–212). New York, NY: Springer.

### Ontology/Platform design

Menichinelli, M., & Valsecchi, F. (2016). The meta-design of systems: how design, data and software enable the organizing of open, distributed, and collaborative processes. In *6th IFDP - Systems & Design: Beyond Processes and Thinking* (pp. 518–537). Valencia: Editorial Universitat Politècnica de València. [https://doi.org/10.4995/IFDP.2016.3301](https://doi.org/10.4995/IFDP.2016.3301)

Menichinelli, M. (2018). Service design and activity theory for the meta-design of collaborative design processes. In *ServDes2018. Service Design Proof of Concept, Proceedings of the ServDes.2018 Conference, 18-20 June, Milano, Italy* (pp. 994–1008). Linköping, Sweden: Linköping University Electronic Press, Linköpings universitet. Retrieved from [http://www.ep.liu.se/ecp/article.asp?issue=150&article=083&volume=#](http://www.ep.liu.se/ecp/article.asp?issue=150&article=083&volume=#)

### Ontology/Platform Research Study

See also the questionnaire, the Jupyter Notebooks and charts on [https://github.com/openp2pdesign/OpenMetaDesignResearchStudy](https://github.com/openp2pdesign/OpenMetaDesignResearchStudy)

Menichinelli, M. (2019). A Research through Design Framework from the Evaluation of a Meta-Design Platform for Open and Collaborative Design and Making Processes. *Proceedings of the Design Society: International Conference on Engineering Design, 1*(1), 21–30. [https://doi.org/10.1017/dsi.2019.5](https://doi.org/10.1017/dsi.2019.5)



## License
[AGPL](https://github.com/openp2pdesign/OpenMetaDesign/blob/master/LICENSE)
