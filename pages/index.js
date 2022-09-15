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
import CircularSlider from "@fseehawer/react-circular-slider";
import { DarkModeSwitch } from "react-toggle-dark-mode";

//TODO: Timer bauen. Wenn ein Regler verändert wurde, dann gibt es ein Timeout von {timeoutValue} und wenn der state des Timers wieder auf null ist dann sind die buttons wieder freigegeben

export default function Home() {
  const [isNight, setIsNight] = useState(false); //true means night
  const [showWantToReset, setShowWantToReset] = useState(false); //state for showing the modal for resetting the dashboard or not
  const [sliderDayTime, setSliderDayTime] = useState(0);
  const [currentDayTime, setCurrentDayTime] = useState(0);
  const [currentUser, setCurrentUser] = useState("");
  const [changeTimeout, setChangeTimeout] = useState(0);
  const timeoutValue = 5; //this variable can be changed to set the value in seconds, how long a timeout till the next possible action should be

  const baseURL = "http://192.168.104.132:30010/remote/object/call";
  const usernamePath =
    "/Game/Biennale_Map.Biennale_Map:PersistentLevel.action_C_2";
  const functionPath =
    "/Game/Biennale_Map.Biennale_Map:PersistentLevel.action_C_2";

  useEffect(() => {
    changeTimeout > 0 &&
      setTimeout(() => setChangeTimeout(changeTimeout - 1), 1000);
  }, [changeTimeout]);

  const createTimeout = () => {
    if (changeTimeout == 0) {
      setChangeTimeout(timeoutValue);
    }
  };
  const dayTimeChecker = () => {
    if (sliderDayTime !== currentDayTime) {
      setCurrentDayTime(sliderDayTime);
      createTimeout();
    }
  };

  //sending daytime to the VR
  const sendDaytime = async () => {
    createTimeout();
    setDayTime({ ...dayTime, changed: false });
    console.log("test");
    const res = await axios.put(baseURL, {
      objectPath: functionPath,
      functionName: "daytime",
      parameters: { daytime: isNight },
      generateTransaction: true,
    });
    console.log(res);
  };

  //sending daytime to the VR
  const sendDayNight = async () => {
    createTimeout();
    const res = await axios.put(baseURL, {
      objectPath: functionPath,
      functionName: "daytime",
      parameters: { daytime: isNight },
      generateTransaction: true,
    });
    console.log(res);
    console.log(isNight);
  };

  //sending the level to the VR
  const sendLevel = async (index) => {
    createTimeout();
    const indexArr = [1, 2, 3];
    const sendArr = indexArr.filter(function (val) {
      return val != index;
    });
    console.log(sendArr);
    const res = await axios.put(baseURL, {
      objectPath: "/Game/Biennale_Map.Biennale_Map:PersistentLevel.action_C_0",
      functionName: "level",
      parameters: { level: index, levels: sendArr },
      generateTransaction: true,
    });
    console.log(res);
    console.log(isNight);
  };

  //function to reset the dashboard for a new user. The window for tipping in a name will appear
  const setNewUser = async () => {
    console.log("game has beeing reseted");
    setShowWantToReset(true);
  };

  //when pushing the reset button just short, nothing would happen
  const doNothing = () => {
    console.log("Karpador setzt Platscher ein.");
  };
  /*
  //a function to change a value in the VR
  const tryAPI = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(baseURL, {
      objectPath:
        "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
      functionName: "fuck2",
      parameters: { Itensity: 3000.0 },
      generateTransaction: true,
    });
    console.log(res);
  };
  const tryAPIONOFF = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(baseURL, {
      objectPath:
        "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
      functionName: "fuck",
      generateTransaction: true,
    });

    console.log(res);
  };
  const tryAnotherRound = async () => {
    setChangeTimeout(timeoutValue);
    const res = await axios.put(baseURL, {
      objectPath:
        "/Game/VRTemplate/Maps/VRTemplateMap.VRTemplateMap:PersistentLevel.Function1_C_9",
      functionName: "fuck3",
      parameters: { color: 2 },
      generateTransaction: true,
    });
    console.log(res);
  };
*/
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
                        console.log(values.name);
                        setCurrentUser(values.name);
                        axios
                          .put(baseURL, {
                            objectPath: usernamePath,
                            functionName: "username",
                            parameters: { username: values.name },
                            generateTransaction: true,
                          })
                          .then((res) => {
                            console.log(res);
                          });
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
                    onClick={() => {
                      sendLevel(0);
                    }}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Realität
                  </Button>
                  <Button
                    onClick={() => {
                      sendLevel(1);
                    }}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Blumenwiese
                  </Button>
                  <br />
                  <Button
                    onClick={() => {
                      sendLevel(2);
                    }}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    Urbaner Garten
                  </Button>
                  <br />
                  <Button
                    onClick={() => {
                      sendLevel(3);
                    }}
                    variant='danger'
                    size='lg'
                    disabled={changeTimeout > 0 ? true : false}>
                    BlumenwieseDeluxe
                  </Button>
                </Col>
                <Col>
                  <Button
                    id={styles.dayTimeButton}
                    disabled={changeTimeout > 0 ? true : false}
                    variant='danger'
                    onClick={() => {
                      setIsNight(!isNight);
                      sendDayNight();
                    }}>
                    {" "}
                    <DarkModeSwitch
                      style={{ marginBottom: "2rem" }}
                      checked={isNight}
                      className={styles.dayTime}
                      size={120}
                      onChange={doNothing}
                    />
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant='danger'
                    disabled={changeTimeout > 0 ? true : false}
                    className={styles.dayTimeCircle}
                    onTouchEnd={dayTimeChecker}>
                    <CircularSlider
                      min={0}
                      max={23}
                      label='Tageszeit'
                      labelColor='#00000'
                      knobColor='#ad3700'
                      progressColorFrom='#b8ddde'
                      progressColorTo='#5b3374'
                      progressSize={15}
                      trackColor='#eeeeee'
                      trackSize={10}
                      onChange={(value) => {
                        setSliderDayTime(value);
                      }}
                    />
                  </Button>{" "}
                </Col>
              </Row>
              <Row>
                <Col></Col>
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
            {changeTimeout !== 0 ? (
              <div className={styles.countdown}>{changeTimeout}</div>
            ) : (
              <></>
            )}

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
                    setIsNight(false);
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
