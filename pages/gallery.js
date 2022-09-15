import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import { Container, Row, Card, Modal } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import { gql, useQuery } from "@apollo/client";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { DiscussionEmbed, CommentCount } from 'disqus-react';

// graphql api client
const client = new ApolloClient({
  uri: "https://gruenaufkumpelin.de/graphql",
  cache: new InMemoryCache(),
});

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

// disqus modal
const DisqusModal = ({
  disqusModalOpen,
  setDisqusModalOpen,
  disqusModalPayload
}) => {
  return (
    <Modal
      show={disqusModalOpen}
      onHide={() => setDisqusModalOpen(false)}
      style={{ padding: 0, borderRadius: "10px" }}>
      <Card>
        <ImageLightbox
          url={disqusModalPayload.url}
          className="responsive border-0 card-img-top" />
      </Card>
      <Modal.Body>

        {/* <div className="text-normal mt-0 pt-0" style={{ whiteSpace: 'pre-wrap' }}>
          <p>{disqusModalPayload.title}</p>
        </div> */}

        <DiscussionEmbed
          shortname='gruenaufkumpelin'
          config={
            {
              url: disqusModalPayload.url,
              identifier: disqusModalPayload.identifier,
              title: disqusModalPayload.title,
            }
          }
        />

        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={() => setDisqusModalOpen(false)}>
            Close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// query
const ALL_SCREENSHOTS_QUERY = gql`
  query allScreenshots {
    screenshots(sort: "createdAt:DESC") {
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

// whole page component
export default function Home() {
  // query
  const { loading, data } = useQuery(ALL_SCREENSHOTS_QUERY, {
    client: client,
    pollInterval: 3000,
    fetchPolicy: 'network-only',
    onCompleted: () => console.log('called'),
    fetchPolicy: 'no-cache',
  });

  // disqus modal open/closed
  const [disqusModalOpen, setDisqusModalOpen] = useState(false);
  const [disqusModalPayload, setDisqusModalPayload] = useState({});


  if (loading) {
    return <div></div>;
  }

  return (
    <div className={styles.gallery}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
        <meta name='theme-color' content='#ffed00' />
        <title>Gallery</title>
        <meta
          name='description'
          content='Controll the VR glasses for the Biennale lala.ruhr 2022'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h1 className={styles.title}>Galerie</h1>
      <Container>
        <Row>
          {data.screenshots.data.map((singleScreenshot, index) => (
            <Col
              className='col-12 col-sm-4 gallery-pic'
              key={singleScreenshot.attributes.url + index}>
              <Card className='ml-4'>
                <div className='position-relative'>
                  <ImageLightbox
                    url={singleScreenshot.attributes.url}
                    className='responsive border-0 card-img-top'
                  />
                </div>
                <Card.Body className='pb-3 pt-3'>
                  <div className='font-weight-bold h5'>
                    {singleScreenshot.attributes.authorName}
                  </div>
                  <div className='text-normal align-self-center'>
                    {Intl.DateTimeFormat(navigator.language, {
                      weekday: "long",
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(singleScreenshot.attributes.createdAt))}
                  </div>
<Link legacyBehavior={false} href="#" onClick={() => {
                      setDisqusModalOpen(true);
                      setDisqusModalPayload({
                        url: singleScreenshot.attributes.url,
                        identifier: singleScreenshot.attributes.url,
                        title: singleScreenshot.attributes.authorName,
                      });
                    }}>
                      <CommentCount
                        shortname='gruenaufkumpelin'
                        config={
                          {
                            url: singleScreenshot.attributes.url,
                            identifier: singleScreenshot.attributes.url,
                            title: singleScreenshot.attributes.authorName,
                          }
                        }
                      >
                        {/* Placeholder Text */}
                        Comments
                      </CommentCount>
                    </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <DisqusModal
        disqusModalOpen={disqusModalOpen}
        setDisqusModalOpen={setDisqusModalOpen}
        disqusModalPayload={disqusModalPayload}
      />
    </div>
  );
}
