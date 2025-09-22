import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import "./Landing.css";

interface Feature {
    title: string;
    description: string;
}

interface TeamMember {
    name: string;
    role: string;
    initials: string;
}

function Landing() {
    const navigate = useNavigate();

    const handleExploreMusic = () => {
        navigate('/index');
    };

    const handleScrollTo = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const features: Feature[] = [
        {
            title: "Búsqueda Avanzada",
            description: "Encuentra cualquier canción, álbum o artista con nuestra potente herramienta de búsqueda. Filtra por género, año, popularidad y más."
        },
        {
            title: "Lista de Favoritos",
            description: "Crea tu colección personal de música favorita. Guarda canciones, álbumes y artistas para acceder a ellos cuando quieras."
        },
        {
            title: "Descubrimiento Musical",
            description: "Encuentra música similar a tus gustos, explora artistas relacionados y descubre nuevos géneros musicales."
        },
        {
            title: "Experiencia Móvil",
            description: "Diseñada desde el primer día para dispositivos móviles. Disfruta de la misma experiencia en tu teléfono, tablet o computadora."
        }
    ];

    const teamMembers: TeamMember[] = [
        { name: "Camila Aylen Ramirez", role: "Cofundadora", initials: "CR" },
        { name: "Alan Vargas", role: "Cofundador", initials: "AV" },

    ];

    return (
        <div className="landing">
            <Header 
                onLogoClick={() => handleScrollTo('inicio')}
            />
            <section id="inicio" className="hero">
                <div className="hero-content">
                    <h1>Descubre, Evalúa y Comparte Música</h1>
                    <p>
                        La plataforma definitiva para amantes de la música. Explora millones de canciones, 
                        álbumes y artistas, lee reseñas auténticas y crea tu propia colección musical.
                    </p>
                    <div className="hero-buttons">
                        <button 
                            onClick={handleExploreMusic}
                            className="btn-primary"
                        >
                            Comenzar Ahora
                        </button>
                        <button 
                            onClick={() => handleScrollTo('funciones')}
                            className="btn-secondary"
                        >
                            Ver Funciones
                        </button>
                    </div>
                </div>
            </section>

            <section id="funciones" className="features">
                <div className="container">
                    <h2 className="section-title">¿Qué puedes hacer en MusicFan?</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <span className="feature-icon">{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="nosotros" className="about">
                <div className="container">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>Quiénes Somos</h2>
                            <p>
                                MusicFan nació de la pasión por conectar a los amantes de la música con las mejores 
                                reseñas y descubrimientos musicales. Somos un equipo de desarrolladores y melómanos 
                                dedicados a crear la mejor experiencia musical digital.
                            </p>
                            <p>
                                Nuestra misión es democratizar el acceso a la información musical de calidad, 
                                proporcionando una plataforma donde tanto críticos profesionales como usuarios 
                                apasionados pueden compartir sus perspectivas sobre la música que nos mueve.
                            </p>
                            <p>
                                Creemos que cada canción tiene una historia que contar, y cada álbum merece ser 
                                descubierto por las personas adecuadas. Con MusicFan, esa conexión es posible.
                            </p>
                        </div>

                        <div className="team-grid">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="team-member">
                                    <div className="team-avatar">{member.initials}</div>
                                    <h4>{member.name}</h4>
                                    <p>{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="ubicacion" className="location">
                <div className="container">
                    <h2 className="section-title">Dónde Estamos</h2>
                    <div className="location-content">
                        <div className="map-container">
                            <div className="map-placeholder">
                                📍
                            </div>
                            <div className="map-attribution">
                                <p>
                                    Datos del mapa © {' '}
                                    <a 
                                        href="http://www.openstreetmap.org/copyright" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        OpenStreetMap
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="address-info">
                            <h3>Nuestra Oficina</h3>
                            <div className="address-details">
                                <p><strong>Dirección:</strong></p>
                                <p>Universidad Nacional Arturo Jauretche</p>
                                <p>Calchaqui 6200</p>
                                <p>Florencio Varela (1888)</p>
                                <p>Buenos Aires, Argentina</p>
                                
                                <div className="contact-hours">
                                    <p><strong>Horarios de Atención:</strong></p>
                                    <p>Lunes a Viernes: 9:00 - 22:00</p>
                                    <p>Sábados: 09:00 - 18:00</p>
                                </div>
                                
                                <div className="contact-info">
                                    <p><strong>Contacto:</strong></p>
                                    <p>Email: contacto@musicfan.com</p>
                                    <p>Teléfono: +54 221 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export { Landing };