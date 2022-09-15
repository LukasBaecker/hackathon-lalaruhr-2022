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
                  <Link
                    legacyBehavior={false}
                    href='#'
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
                    }}>
                    {canUpvote ? (
                      <HeartOutlineIcon
                        size={30}
                        style={{ color: "#FF7F7F" }}
                      />
                    ) : (
                      <HeartIcon size={30} style={{ color: "#FF7F7F" }} />
                    )}
                  </Link>
                </span>
                <Link
                  legacyBehavior={false}
                  href='#'
                  onClick={() => {
                    setDisqusModalOpen(true);
                    setDisqusModalPayload({
                      url: screenshotPayload.attributes.url,
                      identifier: screenshotPayload.attributes.url,
                      title: screenshotPayload.attributes.authorName,
                    });
                  }}>
                  <ChatIcon size={30} className={styles.commentIcon} />
                </Link>
              </div>
            </Col>
          </Row>
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

      <h1 className='mt-4 text-center'>Glück auf, Kumpel*in!</h1>
      <div className={styles.biennaleGallery}>
        <Image
          src='/gruenaufkumpelinLOGO.png'
          alt='Biennale Logo'
          width={100}
          height={100}
        />
      </div>
      <p
        style={{
          margin: "0 50px 50px 50px",
        }}>
        Schön, dass du in die Galerie deiner Erlebnisse und die deiner
        Kumpel*innen. Du kannst dir die Bilder die in unserer VR-Umgebung
        aufgenommen wurden anschauen, deine Liebsten herzen und wenn du magst
        sogar kommentieren. Wir freuen uns eure Kommentare und Anregungen zu
        lesen und freuen uns, dass du bei uns warst.
      </p>
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
