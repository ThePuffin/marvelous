import React, { Component } from "react";
import "./mainpage.css";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import LeftArrow from "@material-ui/icons/ArrowBack";
import RightArrow from "@material-ui/icons/ArrowForward";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 100,
      characters: [],
      more: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        91: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        19: false
      },
      favorite: [],
      favoriteArr: [],
      justFavorite: false
    };
    this.getData = this.getData.bind(this);
    this.show = this.show.bind(this);
    this.moreOrLess = this.moreOrLess.bind(this);
    this.favorite = this.favorite.bind(this);
    this.unfavorite = this.unfavorite.bind(this);
    this.justFavorite = this.justFavorite.bind(this);
  }

  //recupération des données au montage
  componentDidMount() {
    this.getData();
  }

  //montrer les informations complementaires ou non
  show(index) {
    let showMore = { ...this.state.more };
    showMore[index] = !this.state.more[index];
    this.setState({ more: showMore });
  }

  //recupération des données
  getData() {
    axios
      .get("https://gateway.marvel.com/v1/public/characters", {
        params: {
          apikey: "910cb829786b39445197718a990b7e1b",
          offset: this.state.offset,
          limit: 20,
          orderBy: "name"
        }
      })
      .then(res => {
        const characters = res.data.data.results;

        this.setState({
          characters
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  //récupération des données en amont ou aval
  moreOrLess(sign) {
    if (this.state.offset !== 0) {
      sign === "+"
        ? this.setState({ offset: this.state.offset + 5 }, () => {
            this.getData();
          })
        : this.setState({ offset: this.state.offset - 5 }, () => {
            this.getData();
          });
    }
  }

  //ajout en favoris
  favorite(character) {
    let arr = this.state.favorite;
    let arrList = this.state.favoriteArr
    arr.push(character.id);
    arrList.push(character)
    this.setState({ favorite: arr , favoriteArr : arrList });
  }

  deleteCharacter(arr, index){
    return [
      ...arr.slice(0, index),
      ...arr.slice(index + 1, arr.length)
    ]
  }

  //enlever un favori
  unfavorite(character) {
    let arr = this.state.favorite;
    let arrList = this.state.favoriteArr;
    let deleteIt = arr.indexOf(character.id);
    let newArr = this.deleteCharacter(arr, deleteIt);
    let newArrListe = this.deleteCharacter(arrList, deleteIt);
    this.setState({ favorite: newArr, favoriteArr: newArrListe });
  }
  //filtrer ou non suivant les favoris
  justFavorite() {
    this.setState({ justFavorite: !this.state.justFavorite }, () => {
      
      this.state.justFavorite
        ? this.setState({ characters: this.state.favoriteArr })
        : this.getData();
    });
  }

  render() {
    const superHeros = this.state.characters;
    return (
      <div>
        <div className="buttons">
          <Button
            onClick={() => this.moreOrLess("-")}
            variant="contained"
            color="secondary"
          >
            <LeftArrow />+5
          </Button>
          {this.state.favorite.length === 0 && this.state.justFavorite ===false ? null: (
            this.state.justFavorite ? (
              <Button
                onClick={this.justFavorite}
                variant="contained"
                size="large"
                color="secondary"
              >
                All
              </Button>
            ) : (
              <Button
                onClick={this.justFavorite}
                variant="contained"
                size="large"
                color="secondary"
              >
                Favorites
              </Button>
            )
          ) }
          <Button
            onClick={() => this.moreOrLess("+")}
            variant="contained"
            color="secondary"
          >
            +5<RightArrow />
          </Button>
        </div>
        <Grid container spacing={16} className="cardsContainer">
          {this.state.characters.length > 0 ? (
            superHeros.map((hero, index) => (
              <Grid item sm={3} xs={6}>
                <Paper>
                 
                  <CardMedia
                    className="cardTitle, photoCard"
                    title={hero.name}
                    image={`${hero.thumbnail.path}.${hero.thumbnail.extension}`}
                  />
                  <CardContent className="textCard">
                    <h3 onClick={() => this.show(index)}>
                      {hero.name.toUpperCase()}
                    </h3>
                    {this.state.more[index] ? (
                      <div className="moreDatas">
                        {hero.description ? (
                          <p>{hero.description}</p>
                        ) : (
                          <p>No description...</p>
                        )}
                        {hero.stories.items.length > 0 ? (
                          <p>
                            <span>Stories:</span> {hero.stories.items.length}
                          </p>
                        ) : (
                          <p>No story in our database</p>
                        )}
                        {hero.stories.items[0] ? (
                          <div>
                            <span>First stories :</span>
                            <ul>
                              {hero.stories.items
                                .filter((story, index) => index < 3)
                                .map(story => <li>{story.name}</li>)}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : this.state.favorite.includes(hero.id) ? (
                      <Button
                        onClick={() => this.unfavorite(hero)}
                        variant="fab"
                        color="primary"
                      >
                        <Favorite />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => this.favorite(hero)}
                        variant="fab"
                        color="primary"
                        disabled={this.state.favorite.length >= 5}
                      >
                        <FavoriteBorder />
                      </Button>
                    )}
                  </CardContent>
                </Paper>
              </Grid>
            ))
          ) : (
            <div className="loading">
              <CircularProgress size={350} />
            </div>
          )}
        </Grid>
      </div>
    );
  }
}

export default MainPage;
