import React, { Component } from 'react';

import { connect } from 'react-redux';
import store from '../../redux/store';

import { Header, Container, Segment, Grid, Button, Card, Icon, Image, Divider } from 'semantic-ui-react';
import Slider from 'react-animated-slider';

class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        
    } 

    render()
    {
      const footerSlide = <Image style={{position:"absolute", height:"80px", right:"80px", bottom:"80px"}} src="images/aliados/sena.png"/>;
        return (
            <Segment basic style={{padding:"0px", marginTop:"-30px"}}>
                <Slider autoplay={10000}>
                    <div className="slider-content" style={{ background: "url('/images/slide/parque.jpeg') no-repeat center center" }}>
                        <div className="inner">
                            <Grid>
                              <Grid.Column computer={8} tablet={10} mobile={15} floated="right">
                                <Segment textAlign="right" basic style={{backgroundColor:"rgba(0,0,0,.5)", padding:"20px"}}>
                                    <Header as="p" inverted className="font-large">
                                      El parque que había sido escenario de balas, pipetas, sangre y dolor, ahora sitio predilecto en
                                      donde convergen escenarios para el deporte, la recreación y amenas tertulias que se pierden en las noches.
                                      </Header>
                                </Segment>
                              </Grid.Column>
                            </Grid>
                        </div>
                        {footerSlide}
                    </div>
                    <div className="slider-content" style={{ background: "url('/images/slide/casa.jpeg') no-repeat center center" }}>
                        <div className="inner">
                            <Grid centered>
                              <Grid.Column computer={8} tablet={10} mobile={15}>
                                  <Segment textAlign="center" basic vertical={true} style={{backgroundColor:"rgba(0,0,0,.5)", padding:"20px"}}>
                                      <Header as="p" inverted className="font-large">
                                        <i>"El país no sabe lo que es la guerra, lo sabe un poco por la televisión y lo ve como si fuera una
                                        película, no comprende la enorme responsabilidad humana, ética que tenemos ante tanto
                                        sufrimiento” </i> Francisco De Roux.
                                      </Header>
                                  </Segment>
                              </Grid.Column>
                            </Grid>
                        </div>
                        {footerSlide}
                    </div>
                    <div className="slider-content" style={{ background: "url('/images/slide/mural.jpeg') no-repeat center center" }}>
                        <div className="inner">
                            <Grid>
                              <Grid.Column computer={8} tablet={10} mobile={15}>
                                  <Segment textAlign="left" basic vertical={true} style={{backgroundColor:"rgba(0,0,0,.5)", padding:"20px"}}>
                                      <Header as="p" inverted className="font-large">
                                        <i>“La palabra sin acción es vacía, la acción sin la palabra es ciega, la palabra y la acción por fuera del espíritu de la comunidad son la muerte” </i>  
                                         Alvaro Ulcue Chocue, primer Sacerdote Indígenaen Colombia.
                                      </Header>
                                  </Segment>
                              </Grid.Column>
                            </Grid>
                        </div>
                        {footerSlide}
                    </div>
                    <div className="slider-content" style={{ background: "url('/images/slide/dedicatoria.jpeg') no-repeat center center" }}>
                        <div className="inner">
                            <Grid centered>
                              <Grid.Column computer={8} tablet={10} mobile={15}>
                                  <Segment textAlign="center" basic vertical={true} style={{backgroundColor:"rgba(0,0,0,.5)", padding:"20px"}}>
                                      <Header as="p" inverted className="font-large">
                                        <strong>Dedicatoria: </strong> A todas aquellas personas que hicieron parte de este proyecto, en especial a los
                                        pobladores de la cabecera municipal de Toribio, Cauca, quienes han tenido que vivir el azote de la
                                        guerra y esperan que la paz reine en su territorio.
                                      </Header>
                                  </Segment>
                              </Grid.Column>
                            </Grid>
                        </div>
                        {footerSlide}
                    </div>
                </Slider>


                <Container style={{marginTop:"6rem"}} className="gradient-content-1-">
                    <Grid className="" verticalAlign='middle' centered>
                        <Grid.Column computer={6} tablet={6} mobile={16}>
                            <Image src="images/content/casa_destruida.jpeg"/>
                        </Grid.Column>
                        <Grid.Column computer={10} tablet={10} mobile={16}>
                          <Header as="h2">
                            ¿Es posible recuperar la memoria oral de las víctimas del conflicto armado en Colombia, con la aplicación de metodologías de investigación y divulgar la información a través de una plataforma tecnológica?
                          </Header>

                          <p>
                            El conflicto armado en Colombia ha suscitado diferentes acontecimientos que se encuentran guardados en la memoria de las personas con el riesgo eminente de desaparecer, hecho que ocasionó la repetición de la vulneración de los derechos humanos, ante dicho panorama se formuló y desarrolló el proyecto “Recuperación de la memoria oral en torno a la vulneración de los derechos humanos durante el conflicto armado en Colombia: investigación aplicada y creación de un sistema de información open data”, en la cabecera Municipal de Toribio. La información producto de la investigación se encuentra alojada en formatos digitales para ser consultada, usada y reutilizada a través de la plataforma tecnológica de datos abiertos. También permitirá subir nuevos testimonios en diferentes formatos para contribuir a la preservación de la memoria digital del mundo.
                          </p>
                        </Grid.Column>
                    </Grid>
                    <Grid className="" verticalAlign='middle' centered style={{marginTop:"70px"}}>
                        <Grid.Column computer={10} tablet={10} mobile={16}>
                          <Header as="h2">
                            Génesis fenómeno armado en Colombia
                          </Header>

                          <p>
                            Según criterios de diferentes autores, se puede vislumbrar que no hay un consenso unificado para establecer el origen ni las razones fundamentales que llevaron a iniciar el conflicto armado interno ni un único determinante para que se prolongara durante varias décadas en todo el país. Algunos expertos detallan que sus comienzos se pueden rastrear en distintos en periodos, el primero entre 1929 a 1930 y un segundo periodo entre 1957 a 1958; mientras otros argumentan que, en hechos políticos como la lucha por la tierra, la confrontación bipartidista, el Frente Nacional y la época de la violencia son la génesis de este fenómeno armado.
                          </p>
                        </Grid.Column>
                        <Grid.Column computer={6} tablet={6} mobile={16}>
                            <Image src="images/content/paisaje.jpeg"/>
                        </Grid.Column>
                    </Grid>
                    <Grid className="" verticalAlign='middle' centered style={{marginTop:"70px"}}>
                        <Grid.Column computer={6} tablet={6} mobile={16}>
                            <Image src="images/content/mural.jpeg"/>
                        </Grid.Column>
                        <Grid.Column computer={10} tablet={10} mobile={16}>
                          <Header as="h2">
                            Escenario de violencia en el departamento del Cauca
                          </Header>

                          <p>
                            El Cauca fue escenario de hechos de violencia en el marco del conflicto armado interno, el sometimiento a sangre y fuego de las comunidades que lo integran por parte de grupos guerrilleros y otros actores armados como las AUC y paramilitares, predominaron por décadas en la región. La disputa del poder y proyecto de expansión y acumulación territorial, provocó  un intenso accionar como la confrontación armada entre los distintos bandos, y éstos con la fuerza pública, las tomas a los poblados y cabeceras municipales, arremetidas contra los puestos de policía, embocadas para reducir la presencia estatal y neutralizar la influencia del enemigo, además de algunos actos delictivos como la extorsión, el secuestro, y comercialización productos ilícitos (CNMH, TYAG1965-2013, 2016, pág. 28).
                          </p>
                        </Grid.Column>
                    </Grid>

                    <Divider horizontal style={{marginTop:"80px", marginBottom:"40px"}}> 
                      <Header as="h1" className="font-xx-large">Galería</Header>
                    </Divider>

                    <Card.Group itemsPerRow={3} doubling>
                        <Card className="hoverable">
                            <Image src='images/content/cards/3.jpeg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Description>
                                  Recuperar la memoria viva de las personas que fueron víctimas del conflicto armado y le fueron vulnerados sus derechos a través de un proceso metodológico de sistematización de la información.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card className="hoverable">
                            <Image src='images/content/cards/1.jpeg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Description>
                                  Metodología de investigación y práctica técnica Historias de Vida, se evidencia subjetividad, a través de relatos, vivencias con fuerte carga de sentimientos, juicios y valores, una biografía de sus vidas, de los hechos y sucesos que por años tuvieron que padecer bajo el flagelo de la guerra, de aquel conflicto armado que parecía no acabar en ese pequeño territorio de la cabecera municipal de Toribio, Cauca.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card className="hoverable">
                            <Image src='images/content/cards/4.jpeg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Description>
                                  Desde el proceso por la paz, el cese al fuego bilateral y por último la firma de los acuerdos,  ha transformado positivamente el ambiente del casco urbano de Toribio.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card className="hoverable">
                            <Image src='images/content/cards/5.jpeg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Description>
                                  La ubicación geográfica de Toribio, norte del Cauca, zona de masiva afluencia de población y tránsito constante a departamentos como el Valle, Tolima y Huila; este territorio se ha convertido en el corredor terrestre más importante, comunicando las regiones orientales del país con el pacífico y el sur (Murillo, 2015, pág. 22).
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card className="hoverable">
                            <Image src='images/content/cards/2.jpeg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Description>
                                  La recuperación  la memoria oral del conflicto, no para ahondar heridas, sino para contar una realidad, una verdad de muchos silencios que quedaron resguardados por miedo o porque simplemente recordar les hacían daño, una verdad que necesitaba el país escuchar, una verdad que no podía quedar en desechada, y  ellos, cada uno de los habitantes de la cabecera municipal, tenía una carga de historia que contar, y que nosotros, los demás colombianos estábamos dispuestos a escuchar, pues su sentir es también el de nosotros.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        <Card className="hoverable">
                            <Image src='images/content/cards/6.jpeg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Description>
                                  El conflicto armado en Colombia ha suscitado diferentes acontecimientos que se encuentran guardados en la memoria de las personas, los narran, los discuten en largas tertulias de plazas de mercado, parques o al calor de una chimenea; lastimosamente se han perdido en el   tiempo lo que ha ocasionado la repetición de la vulneración de los derechos humanos, ante dicho panorama se creó el proyecto para la recuperación de la memoria oral del conflicto armado en formatos digitales que podrán ser consultados a través de una plataforma tecnológica de datos abiertos, en donde se plasmó las vivencias a través de videos, audios y fotografías para que el mundo conozca una historia viva pero olvidada.  Se tomó como muestra el casco urbano de Toribio en donde habitan gentes de gran valentía que han pervivido a través del tiempo, son los verdaderos héroes en esta historia.  La plataforma permitirá que la comunidad pueda subir sus testimonios en diferentes formatos de tal manera que se contribuye a la preservación digital de la memoria del mundo.
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Container>
            </Segment>
        );
    }
}


const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
