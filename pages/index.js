import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import axios from "axios";
import useLongPress from "../useLongPress";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";

//TODO: Timer bauen. Wenn ein Regler verändert wurde, dann gibt es ein Timeout von {timeoutValue} und wenn der state des Timers wieder auf null ist dann sind die buttons wieder freigegeben

export default function Home() {
  const [showWantToReset, setShowWantToReset] = useState(false); //state for showing the modal for resetting the dashboard or not
  const [currentUser, setCurrentUser] = useState("");
  const [changeTimeout, setChangeTimeout] = useState(0);
  const timeoutValue = 60; //this variable can be changed to set the value in seconds, how long a timeout till the next possible action should be

  useEffect(() => {
    changeTimeout > 0 &&
      setTimeout(() => setChangeTimeout(changeTimeout - 1), 1000);
  }, [changeTimeout]);

  //function to reset the dashboard for a new user. The window for tipping in a name will appear
  const setNewUser = async () => {
    console.log("game has beeing reseted");
    setShowWantToReset(true);
  };

  //when pushing the reset button just short, nothing would happen
  const doNothing = () => {
    console.log("nothing done");
  };

  //a function to change a value in the VR
  const tryAPI = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(
      "http://192.168.137.1:30010/remote/object/call",
      {
        objectPath:
          "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
        functionName: "fuck2",
        parameters: { Itensity: 3000.0 },
        generateTransaction: true,
      }
    );
    console.log(res);
  };
  const tryAPIONOFF = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(
      "http://192.168.137.1:30010/remote/object/call",
      {
        objectPath:
          "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
        functionName: "fuck",
        generateTransaction: true,
      }
    );

    console.log(res);
  };
  const tryAnotherRound = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(
      "http://192.168.137.1:30010/remote/object/call",
      {
        objectPath:
          "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
        functionName: "fuck3",
        parameters: { color: 1 },
        generateTransaction: true,
      }
    );
    console.log(res);
  };

  //parameters for the longpress event hook
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 2500,
  };
  const longPressEvent = useLongPress(setNewUser, doNothing, defaultOptions);

  return (
    <div className={styles.container}>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon-192x192.png' />
        <meta name='theme-color' content='#ffed00' />
        <title>VR Controller</title>
        <meta
          name='description'
          content='Controll the VR glasses for the Biennale lala.ruhr 2022'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        {currentUser === "" ? (
          <>
            <h1 className={styles.title}>Wer hat gerade die VR-Brille auf?</h1>
            <Container className={styles.dashboard}>
              <Row>
                <Col className={styles.nameForm}>
                  <Formik
                    initialValues={{ name: "" }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      setSubmitting(true);
                      if (values.name === "") {
                        setSubmitting(false);
                      } else {
                        setCurrentUser(values.name);
                      }
                    }}>
                    {/* Callback function containing Formik state and helpers that handle common form actions */}
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <Form onSubmit={handleSubmit} className='mx-auto'>
                        <Form.Group className='form-group' controlId='formName'>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type='text'
                            name='name'
                            placeholder=''
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className={
                              touched.name && errors.name ? "errorForm" : null
                            }
                          />
                          {touched.name && errors.name ? (
                            <div className='errorForm-message'>
                              {errors.name}
                            </div>
                          ) : null}
                        </Form.Group>
                        <Button
                          className='form-group'
                          variant='danger'
                          type='submit'
                          disabled={isSubmitting}>
                          Starten
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Verändere die Ansicht!</h1>
            <Container className={styles.dashboard}>
              <Row>
                <Col className={styles.szenarioButtons}>
                  <h2>Wähle ein Szenario</h2>
                  <Button
                    onClick={tryAPI}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Wald
                  </Button>
                  <br />
                  <Button
                    onClick={tryAPIONOFF}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Urbaner Garten
                  </Button>
                  <br />
                  <Button
                    onClick={tryAnotherRound}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Blumenwiese
                  </Button>
                </Col>
                <Col>2 of 2</Col>
              </Row>
              <Row>
                <Col></Col>
                <Col>Countdown: {changeTimeout}</Col>
                <Col>3 of 3</Col>
              </Row>
            </Container>
            <span>
              <a {...longPressEvent} className={styles.resumeCard}>
                <Image
                  src='/icons8-restart.svg'
                  alt='Reload Button'
                  width={50}
                  height={50}
                />
              </a>
            </span>
            <Modal
              show={showWantToReset}
              onHide={() => {
                setShowWantToReset(false);
              }}
              backdrop='static'
              keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Möchtest du das Dashboard zurücksetzten?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Button
                  variant='primary'
                  onClick={() => {
                    setCurrentUser("");
                    setShowWantToReset(false);
                    setChangeTimeout(0);
                  }}>
                  Ja
                </Button>
                <Button
                  variant='danger'
                  onClick={() => {
                    setShowWantToReset(false);
                  }}>
                  Nein, weitermachen!
                </Button>
              </Modal.Body>
            </Modal>
          </>
        )}
        <span className={styles.biennale}>
          <Image
            src='/2022-04-19_lala-Biennale_Logo_gelb-uai-516x175.png'
            alt='Biennale Logo'
            width={258}
            height={88}
          />
        </span>
      </main>
    </div>
  );
}
