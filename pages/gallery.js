import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import {
  Container,
  Row,
  Card,
  Modal,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { gql, useQuery, useMutation } from "@apollo/client";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { DiscussionEmbed, CommentCount } from "disqus-react";
import HeartIcon from "mdi-react/HeartIcon";
import HeartOutlineIcon from "mdi-react/HeartOutlineIcon";
import ChatIcon from "mdi-react/ChatIcon";
import CityIcon from "mdi-react/CityIcon"; //reality
import NaturePeopleIcon from "mdi-react/NaturePeopleIcon"; //park and garden
import FlowerIcon from "mdi-react/FlowerIcon"; //flower
import ForestIcon from "mdi-react/ForestIcon"; //forest
import WhiteBalanceSunnyIcon from "mdi-react/WhiteBalanceSunnyIcon"; //sun
import WeatherFogIcon from "mdi-react/WeatherFogIcon"; //foggy
import WeatherPouringIcon from "mdi-react/WeatherPouringIcon"; //rain
import WeatherLightningRainyIcon from "mdi-react/WeatherLightningRainyIcon"; //thunderstorm
import WeatherDustIcon from "mdi-react/WeatherDustIcon"; //sandstorm

// graphql api client
const client = new ApolloClient({
  uri: "https://gruenaufkumpelin.de/graphql",
  cache: new InMemoryCache(),
});

// all the text
const reality12 =
  "Dieser Raum bietet zwar viel Platz für Pop-up-Veranstaltungen, ist aber an normalen Tagen einfallslos und ein wenig langweilig. Bei dieser globalen Durchschnittstemperatur kann es hier im Sommer heiß werden, aber im Allgemeinen ist es noch erträglich. Ohne Pflanzen ist dies jedoch eine tote Zone, was die Artenvielfalt angeht. ";
const reality34 =
  "Wenn die globale Durchschnittstemperatur auf dieses Niveau ansteigt, wird sich dieser Platz an Sommertagen in eine Hitzeinsel verwandeln: Ein Ort, an dem man sich lieber nicht aufhalten möchte. Die Oberfläche nimmt die Wärme auf und speichert sie für später, was die Heizspirale weiter antreibt. Nichts lebt hier, Tiere können nicht überleben.";
const walnut12 =
  "Ein sehr lebenswertes Szenario: Diese Landschaft bietet Platz zum Entspannen und zur Verbindung mit der städtischen Natur. Große, alte Bäume tragen zur Abkühlung des lokalen Mikroklimas bei, und ihre Präsenz im Herzen der Stadt zeigt unsere Wertschätzung für die Ökosystemleistungen, die sie erbringen.";
const walnut34 =
  "Bei dieser globalen Durchschnittstemperatur sind es die Bäume, auf die wir uns verlassen müssen, um das lokale Mikroklima zu steuern. Dank ihnen verwandelt sich dieser Platz nicht in eine städtische Wärmeinsel. Diese Landschaft könnte auch an den heißeren Tagen noch genossen werden.";
const garden12 =
  "Dieses Szenario gewinnt Punkte für das Engagement der Gemeinschaft und die Verbindung der Stadtbewohner mit der Natur. Bei diesem Niveau der globalen Durchschnittstemperatur können Sie sich einen Garten vorstellen, der eher wie der eines Ortes weiter südlich von hier aussieht. Insekten sagen danke: Gärten und Wiesen sind genau das, was sie zum Gedeihen brauchen.";
const garden34 =
  "Dieses Szenario gewinnt Punkte für das Engagement der Gemeinschaft und die Verbindung der Stadtbewohner mit der Natur. Bei diesem Niveau der globalen Durchschnittstemperatur ist die Wahrscheinlichkeit, dass die Ernten durch extreme Wetterbedingungen geschädigt werden, recht hoch. Extremes urbanes Gärtnern.";
const forest12 =
  "Was wäre, wenn die Natur die Führung übernehmen würde? Auch wenn dies schwer vorstellbar ist, so gewinnt dieses Szenario doch alle Punkte in Bezug auf Artenvielfalt, Wasserbindung und Kühlwirkung. Alte, große Bäume haben den höchsten Kühleffekt und ihr allgemeiner Wert für das Ökosystem wird oft unterschätzt.";
const forest34 =
  "Was wäre, wenn die Natur die Führung übernehmen würde? Auch wenn es schwer vorstellbar ist, würde ein alter Wald mit massiven Bäumen das Mikroklima auf diesem Platz unter diesen heißen Bedingungen wahrscheinlich viel erträglicher machen.";

const sonne12 =
  "Wenn es uns gelingt, die globale Durchschnittstemperatur auf diesem Niveau zu halten, werden die Sonnentage hier schön und angenehm sein.";
const sonne34 =
  "Wenn die globale Durchschnittstemperatur auf dieses Niveau ansteigt, werden sonnige Tage hier oft unerträglich sein und Teile Gelsenkirchens in eine städtische Wärmeinsel verwandeln.";
const nebel12 =
  "Wenn es uns gelingt, die globale Durchschnittstemperatur auf diesem Niveau zu halten, werden mystische Nebeltage genauso häufig vorkommen wie heute.";
const nebel34 =
  "Wenn die globale Durchschnittstemperatur auf dieses Niveau ansteigt, wird die Luftfeuchtigkeit sinken und neblige Tage werden die Ausnahme sein.";
const regen12 =
  "Wenn es uns gelingt, die globale Durchschnittstemperatur auf diesem Niveau zu halten, wird der Regen ähnlich mild und angenehm sein wie jetzt.";
const regen34 =
  "Wenn die globale Durchschnittstemperatur auf dieses Niveau ansteigt, wird der Regen zu unerwarteten Zeiten und in unerwarteter Menge kommen. Mehr auf einmal, weniger im Durchschnitt.";
const gewitter12 =
  "Wenn es uns gelingt, die globale Durchschnittstemperatur auf diesem Niveau zu halten, werden uns Gewitter nicht mit außergewöhnlicher Stärke und Zerstörung überraschen.";
const gewitter34 =
  "Wenn die globale Durchschnittstemperatur auf dieses Niveau ansteigt, wird es zur neuen Normalität werden, von einem Gewitter überrascht zu werden. Überschwemmungen werden an der Tagesordnung sein, gefolgt von Perioden unfruchtbarer Trockenheit.";
const sandsturm12 =
  "Wenn es uns gelingt, die globale Durchschnittstemperatur auf diesem Niveau zu halten, werden Sandstürme hierzulande nur in unserer Vorstellung existieren. Und in der VR, natürlich.";
const sandsturm34 =
  "Wenn die globale Durchschnittstemperatur auf dieses Niveau ansteigt, könnte ein Sandsturmereignis aus unserer Vorstellungskraft (und VR) in die Realität übergehen.";

// query for all screenshots
const ALL_SCREENSHOTS_QUERY = gql`
  query allScreenshots($sortBy: [String]) {
    screenshots(sort: $sortBy) {
      data {
        id
        attributes {
          url
          authorName
          createdAt
          upvoteCount
          currentSettings
        }
      }
    }
  }
`;

// mutation to upvote a screenshot
const UPVOTE_SCREENSHOT_MUTATION = gql`
  mutation upvoteScreenshot($id: ID!, $upvoteCount: Int) {
    updateScreenshot(id: $id, data: { upvoteCount: $upvoteCount }) {
      data {
        id
        attributes {
          upvoteCount
        }
      }
    }
  }
`;

// image component that can maximise the image
const ImageLightbox = ({ url, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Link legacyBehavior={false} href='#' onClick={() => setIsOpen(true)}>
        <img src={url} alt='VR screenshot' className={className} />
      </Link>

      {isOpen && (
        <Lightbox
          animationDisabled
          mainSrc={url}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// disqus modal component
const DisqusModal = ({
  disqusModalOpen,
  setDisqusModalOpen,
  disqusModalPayload,
}) => {
  return (
    <Modal
      show={disqusModalOpen}
      onHide={() => setDisqusModalOpen(false)}
      style={{ padding: 0, borderRadius: "10px" }}
      size='lg'>
      <Card>
        <ImageLightbox
          url={disqusModalPayload.url}
          className='responsive border-0 card-img-top'
        />
      </Card>
      <Modal.Body>
        {/* <div className="text-normal mt-0 pt-0" style={{ whiteSpace: 'pre-wrap' }}>
          <p>{disqusModalPayload.title}</p>
        </div> */}

        <DiscussionEmbed
          shortname='gruenaufkumpelin'
          config={{
            url: disqusModalPayload.url,
            identifier: disqusModalPayload.identifier,
            title: disqusModalPayload.title,
          }}
        />

        <div className='text-center mt-3'>
          <button
            className='btn btn-danger'
            onClick={() => setDisqusModalOpen(false)}>
            Schließen
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const getScenarioInfo = (scenarioNumber, temperature) => {
  let info = {
    name: "",
    description: "",
  };
  if (scenarioNumber === 0) {
    // reality
    info.name = "Aktuelle Realität";
    if (temperature < 3) {
      info.description = reality12;
    } else {
      info.description = reality34;
    }
  }

  if (scenarioNumber === 1) {
    // Walnussbaum
    info.name = "Walnussbaum";
    if (temperature < 3) {
      info.description = walnut12;
    } else {
      info.description = walnut34;
    }
  }

  if (scenarioNumber === 2) {
    // Blumenwiese
    info.name = "Blumenwiese";
    if (temperature < 3) {
      info.description = garden12;
    } else {
      info.description = garden34;
    }
  }

  if (scenarioNumber === 3) {
    // Wald
    info.name = "Wald";
    if (temperature < 3) {
      info.description = forest12;
    } else {
      info.description = forest34;
    }
  }

  return info;
};

const getWeatherInfo = (weatherNumber, temperature) => {
  let info = {
    name: "",
    description: "",
  };

  if (weatherNumber === 1) {
    // Sonne
    info.name = "Sonne";
    if (temperature < 3) {
      info.description = sonne12;
    } else {
      info.description = sonne34;
    }
  }

  if (weatherNumber === 2) {
    // Nebel
    info.name = "Nebel";
    if (temperature < 3) {
      info.description = nebel12;
    } else {
      info.description = nebel34;
    }
  }

  if (weatherNumber === 3) {
    // Regen
    info.name = "Regen";
    if (temperature < 3) {
      info.description = regen12;
    } else {
      info.description = regen34;
    }
  }

  if (weatherNumber === 4) {
    // Gewitter
    info.name = "Gewitter";
    if (temperature < 3) {
      info.description = gewitter12;
    } else {
      info.description = gewitter34;
    }
  }

  if (weatherNumber === 5) {
    // Sandsturm
    info.name = "Sandsturm";
    if (temperature < 3) {
      info.description = sandsturm12;
    } else {
      info.description = sandsturm34;
    }
  }

  return info;
};

// conditions info modal
const InfoModal = ({ infoModalOpen, setInfoModalOpen, infoModalPayload }) => {
  return (
    <Modal
      show={infoModalOpen}
      onHide={() => setInfoModalOpen(false)}
      style={{ padding: 0, borderRadius: "10px" }}
      size='lg'>
      <Modal.Body>
        {/* <div className="text-normal mt-0 pt-0" style={{ whiteSpace: 'pre-wrap' }}>
          <p>{disqusModalPayload.title}</p>
        </div> */}
        <div
          className='text-start ml-2 mt-2 mr-2'
          style={{
            marginLeft: "15px",
            marginTop: "20px",
            marginRight: "15px",
          }}>
          <h4 style={{ marginTop: "20px" }}>Globale Durchschnittstemperatur</h4>
          <p>
            +{infoModalPayload.attributes?.currentSettings?.currentTemperature}
            °C
          </p>
          <h4 style={{ marginTop: "20px" }}>
            Wetter:{" "}
            {
              getWeatherInfo(
                infoModalPayload.attributes?.currentSettings?.currentWeather,
                infoModalPayload.attributes?.currentSettings?.currentTemperature
              ).name
            }
          </h4>
          <p>
            {
              getWeatherInfo(
                infoModalPayload.attributes?.currentSettings?.currentWeather,
                infoModalPayload.attributes?.currentSettings?.currentTemperature
              ).description
            }
          </p>
          <h4 style={{ marginTop: "20px" }}>
            Szenario:{" "}
            {
              getScenarioInfo(
                infoModalPayload.attributes?.currentSettings?.activeSzenario,
                infoModalPayload.attributes?.currentSettings?.currentTemperature
              ).name
            }
          </h4>
          <p>
            {
              getScenarioInfo(
                infoModalPayload.attributes?.currentSettings?.activeSzenario,
                infoModalPayload.attributes?.currentSettings?.currentTemperature
              ).description
            }
          </p>
        </div>

        <div className='text-center mt-3'>
          <button
            className='btn btn-danger'
            onClick={() => setInfoModalOpen(false)}>
            Schließen
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// single screenshot card component
const SingleScreenshotCard = ({
  screenshotPayload,
  index,
  setDisqusModalOpen,
  setDisqusModalPayload,
  setInfoModalOpen,
  setInfoModalPayload,
}) => {
  const [upvoteCount, setUpvoteCount] = useState(
    screenshotPayload.attributes.upvoteCount
  );
  const [canUpvote, setCanUpvote] = useState(true);
  // upvote mutation
  const [upvoteScreenshot] = useMutation(UPVOTE_SCREENSHOT_MUTATION, {
    client: client,
  });

  return (
    <Col
      className='col-12 col-sm-4 gallery-pic'
      key={screenshotPayload.attributes.url + index}>
      <Card className='ml-4'>
        <div className='position-relative'>
          <ImageLightbox
            url={screenshotPayload.attributes.url}
            className='responsive border-0 card-img-top'
          />
        </div>
        <Card.Body className='pb-3 pt-3'>
          <Row>
            <Col>
              <div className='font-weight-bold h5'>
                {screenshotPayload.attributes.authorName}
              </div>

              <div className='text-normal align-self-center'>
                {Intl.DateTimeFormat(navigator.language, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(screenshotPayload.attributes.createdAt))}
              </div>
            </Col>
            <Col className={styles.reactionCol}>
              <div className='text-end'>
                <span className='fs-5 align-bottom'>
                  {upvoteCount && upvoteCount + " "}
                </span>
                <span className='align-baseline'>
                  {canUpvote ? (
                    <HeartOutlineIcon
                      size={30}
                      style={{ color: "#FF7F7F", cursor: "pointer" }}
                      onClick={() => {
                        if (canUpvote) {
                          upvoteScreenshot({
                            variables: {
                              id: screenshotPayload.id,
                              upvoteCount: upvoteCount + 1,
                            },
                          }).then(() => {
                            setUpvoteCount(upvoteCount + 1);
                            setCanUpvote(false);
                          });
                        }
                      }}
                    />
                  ) : (
                    <HeartIcon size={30} style={{ color: "#FF7F7F" }} />
                  )}
                </span>
                <ChatIcon
                  size={30}
                  className={styles.commentIcon}
                  onClick={() => {
                    setDisqusModalOpen(true);
                    setDisqusModalPayload({
                      url: screenshotPayload.attributes.url,
                      identifier: screenshotPayload.attributes.url,
                      title: screenshotPayload.attributes.authorName,
                    });
                  }}
                />
              </div>
            </Col>
          </Row>
          <div
            className='conditionBox'
            onClick={() => {
              setInfoModalOpen(true);
              setInfoModalPayload(screenshotPayload);
            }}>
            {/*Temperature:*/}+
            {screenshotPayload.attributes.currentSettings?.currentTemperature}°C
            {/*Scenario:*/}
            {screenshotPayload.attributes.currentSettings?.activeSzenario ===
              0 && <CityIcon size={30} className='conditionIcon' />}
            {screenshotPayload.attributes.currentSettings?.activeSzenario ===
              1 && <NaturePeopleIcon size={30} className='conditionIcon' />}
            {screenshotPayload.attributes.currentSettings?.activeSzenario ===
              2 && <FlowerIcon size={30} className='conditionIcon' />}
            {screenshotPayload.attributes.currentSettings?.activeSzenario ===
              3 && <ForestIcon size={30} className='conditionIcon' />}
            {/*Weather:*/}
            {screenshotPayload.attributes.currentSettings?.currentWeather ===
              1 && (
              <WhiteBalanceSunnyIcon size={30} className='conditionIcon' />
            )}
            {screenshotPayload.attributes.currentSettings?.currentWeather ===
              2 && <WeatherFogIcon size={30} className='conditionIcon' />}
            {screenshotPayload.attributes.currentSettings?.currentWeather ===
              3 && <WeatherPouringIcon size={30} className='conditionIcon' />}
            {screenshotPayload.attributes.currentSettings?.currentWeather ===
              4 && (
              <WeatherLightningRainyIcon size={30} className='conditionIcon' />
            )}
            {screenshotPayload.attributes.currentSettings?.currentWeather ===
              5 && <WeatherDustIcon size={30} className='conditionIcon' />}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

// whole page component
export default function Home() {
  // disqus modal open/closed
  const [disqusModalOpen, setDisqusModalOpen] = useState(false);
  const [disqusModalPayload, setDisqusModalPayload] = useState({});

  // info modal open/closed
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPayload, setInfoModalPayload] = useState({});

  // decide how we sort
  const [sortByUpvotes, setSortByUpvotes] = useState(false);
  // query
  const { loading, data } = useQuery(ALL_SCREENSHOTS_QUERY, {
    variables: {
      sortBy: sortByUpvotes
        ? ["upvoteCount:DESC", "createdAt:DESC"]
        : ["createdAt:DESC"],
    },
    client: client,
    pollInterval: 3000,
    fetchPolicy: "network-only",
    onCompleted: () => console.log("called"),
    fetchPolicy: "no-cache",
  });

  return (
    <div className={styles.gallery}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
        <meta name='theme-color' content='#ffed00' />
        <title>Galerie</title>
        <meta
          name='description'
          content='Galerie: the Biennale lala.ruhr 2022'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h1 className='mt-4 text-center'>Grün auf, Kumpel*in!</h1>
      <div className={styles.biennaleGallery}>
        <Image
          src='/gruenaufkumpelinLOGO.png'
          alt='Biennale Logo'
          width={100}
          height={100}
        />
      </div>
      <div className='text-center'>
        <p className='mb-1'>Schön, dass Du da bist!</p>
        <p className='mb-1'>
          Hier kannst Du alle aufgenommen Bilder aus unserer VR-Umgebung sehen.
        </p>
        <p className='mb-1'>
          Lass gerne ein Like da, oder schreibe Deine Gedanken nieder.
        </p>
        <p>
          Außerdem kannst du dich über die Icons der im jeweiligen Screenshot
          vorherrschenden Bedingungen über das Klima informieren.
        </p>
      </div>
      <div className='text-center'>
        <ButtonGroup className='mb-3'>
          <ToggleButton
            type='radio'
            id='latest'
            variant={!sortByUpvotes ? "danger" : "secondary"}
            style={{ marginRight: 0, boxShadow: "none", minWidth: "150px" }}
            name='radio'
            onChange={(e) => setSortByUpvotes(false)}>
            Neueste
          </ToggleButton>
          <ToggleButton
            type='radio'
            id='popular'
            variant={sortByUpvotes ? "danger" : "secondary"}
            style={{ boxShadow: "none", minWidth: "150px" }}
            name='radio'
            onChange={(e) => setSortByUpvotes(true)}>
            Beliebt
          </ToggleButton>
        </ButtonGroup>
      </div>

      {!loading && (
        <>
          <Container>
            <Row>
              {data.screenshots.data.map((singleScreenshot, index) => (
                <SingleScreenshotCard
                  screenshotPayload={singleScreenshot}
                  setDisqusModalOpen={setDisqusModalOpen}
                  setDisqusModalPayload={setDisqusModalPayload}
                  setInfoModalPayload={setInfoModalPayload}
                  setInfoModalOpen={setInfoModalOpen}
                  index={index}
                  key={index}
                />
              ))}
            </Row>
          </Container>
        </>
      )}
      <div className={styles.footer}>
        <a
          href='https://www.lala.ruhr/impressum/'
          rel='noreferrer'
          target='_blank'>
          Impressum
        </a>
        {"|"}
        <a
          href='https://www.lala.ruhr/datenschutz/'
          rel='noreferrer'
          target='_blank'>
          Datenschutz
        </a>
      </div>

      <DisqusModal
        disqusModalOpen={disqusModalOpen}
        setDisqusModalOpen={setDisqusModalOpen}
        disqusModalPayload={disqusModalPayload}
      />

      <InfoModal
        infoModalOpen={infoModalOpen}
        setInfoModalOpen={setInfoModalOpen}
        infoModalPayload={infoModalPayload}
      />
    </div>
  );
}
