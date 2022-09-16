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

// single screenshot card component
const SingleScreenshotCard = ({
  screenshotPayload,
  index,
  setDisqusModalOpen,
  setDisqusModalPayload,
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
              //TODO: implement modal and show all of the three infos
              console.log("here to open the modal");
            }}>
            {/*TODO: adding conditional rendering*/}

            {"+4°C" /**showing the temp */}
            <CityIcon size={30} className='conditionIcon' />
            <WhiteBalanceSunnyIcon size={30} className='conditionIcon' />
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
        <p className='mb-1'>Schön das Du da bist!</p>
        <p className='mb-1'>
          Hier kannst Du alle aufgenommen Bilder aus unserer VR-Umgebung sehen.
        </p>
        <p className='mb-1'>
          Lass gerne ein Like da, oder schreibe Deine Gedanken nieder.
        </p>
        <p>Vielen Dank für Deinen Besuch.</p>
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
    </div>
  );
}
