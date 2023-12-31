import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./BreweryList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBeerMugEmpty,
  faLink,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

//Image imports
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

//Brew images
const brewImages = importAll(
  require.context("./images-brews", false, /\.(png|jpe?g|svg)$/)
);

function BreweryList() {
  const [breweries, setBreweries] = useState([]);
  const { city } = useParams();

  useEffect(() => {
    fetch("http://localhost:3000/breweries")
      .then(r => r.json())
      .then(breweries => setBreweries(breweries));
  }, []);

  const breweriesToDisplay = breweries.filter(brewery => city === brewery.city);

  function handleLike(breweryId) {
    const updatedBreweries = breweries.map(brew => {
      if (brew.id.toString() === breweryId.toString()) {
        return { ...brew, likes: brew.likes + 1 };
      }
      return brew;
    });
    setBreweries(updatedBreweries);

    fetch(`http://localhost:3000/breweries/${breweryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likes: updatedBreweries.find(
          b => b.id.toString() === breweryId.toString()
        ).likes,
      }),
    });
  }

  return (
    <div className="brew-cards">
      {breweriesToDisplay.map(brewery => (
        <Card className="card-item" key={brewery.id}>
          <Card.Img
            variant="top"
            src={brewImages[brewery.image]}
            alt="Stock brewery image"
          />
          <Button onClick={() => handleLike(brewery.id)}>
            Likes: {brewery.likes} <FontAwesomeIcon icon={faBeerMugEmpty} />
          </Button>
          <Card.Body>
            <Card.Title>{brewery.name}</Card.Title>
            <Card.Text>Type: {brewery.type}</Card.Text>
            <Card.Text>{brewery.address}</Card.Text>
            <Card.Text>
              {brewery.city}, {brewery.state} {brewery.zip}
            </Card.Text>
            <Card.Text>
              <FontAwesomeIcon icon={faPhone} />
              {brewery.phone
                ? " " +
                  brewery.phone.substring(0, 3) +
                  "-" +
                  brewery.phone.substring(3, 6) +
                  "-" +
                  brewery.phone.substring(6, 10)
                : null}
            </Card.Text>
            <br />
            <br />
            {brewery.url ? (
              <Button
                href={brewery.url}
                target="_blank"
                className="website-button"
              >
                <FontAwesomeIcon icon={faLink} />
              </Button>
            ) : null}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default BreweryList;
