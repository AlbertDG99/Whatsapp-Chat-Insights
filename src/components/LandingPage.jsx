import React from 'react';
import FileUploader from './FileUploader';
import { MessageSquare, Shield, BarChart2, Zap } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import FadeInSection from './common/FadeInSection';
import styles from './LandingPage.module.css';

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 2000 }
};

const barChartOptions = {
  ...commonOptions,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: {
      display: true,
      ticks: { color: '#e9edef', font: { size: 12, weight: 'bold' } },
      grid: { display: false }
    },
    y: { display: false }
  }
};

const lineChartOptions = {
  ...commonOptions,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { color: '#e9edef', boxWidth: 10 }
    },
    tooltip: { enabled: true }
  },
  scales: {
    x: {
      display: true,
      ticks: { color: '#8696a0', font: { size: 10 } },
      grid: { display: false }
    },
    y: { display: false }
  }
};

const LandingPage = ({ onDataLoaded, onLoading }) => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <FadeInSection>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Descubre que dicen tus chats realmente</h1>
            <p className="hero-subtitle">
              Analiza tus conversaciones de WhatsApp de forma <strong>100% segura y privada</strong>.
              Tus datos nunca salen de tu dispositivo.
            </p>

            <div className={styles.uploadWrapper}>
              <FileUploader onDataLoaded={onDataLoaded} onLoading={onLoading} />
            </div>
          </div>
        </FadeInSection>
      </div>

      <div className={styles.section}>
        <FadeInSection>
          <h2 className={styles.sectionTitle}>¿Qué vas a descubrir?</h2>
        </FadeInSection>
        <div className={styles.grid}>

          {/* Card 1: King of Text */}
          <FadeInSection delay="0.1s">
            <div className={styles.exampleCard}>
              <div className={styles.exampleEmoji}>👑</div>
              <h3>El Rey del Texto</h3>
              <p>"¿Siempre has tenido dudas de quién es el que nunca se calla? Descubre quién es el rey imbatible de darle a la lengua."</p>
              <div className={styles.mockChart}>
                <Bar
                  data={{
                    labels: ['Santi 🎸', 'Leo ⚽', 'Yo'],
                    datasets: [{
                      label: 'Mensajes',
                      data: [850, 420, 150],
                      backgroundColor: ['rgba(255,255,255,0.2)', '#00a884', 'rgba(255,255,255,0.2)'],
                      borderRadius: 4
                    }]
                  }}
                  options={barChartOptions}
                />
              </div>
            </div>
          </FadeInSection>

          {/* Card 2: Night Owl */}
          <FadeInSection delay="0.2s">
            <div className={styles.exampleCard}>
              <div className={styles.exampleEmoji}>🦉</div>
              <h3>El Búho Nocturno</h3>
              <p>"¿Quién manda memes a las 3 AM? Revela quién mantiene el grupo vivo mientras el resto del mundo duerme."</p>
              <div className={styles.mockChart}>
                <Line
                  data={{
                    labels: ['00:00', '01:00', '02:00', '03:00', '04:00'],
                    datasets: [{
                      label: 'Mensajes de Alex',
                      data: [12, 45, 32, 15, 2],
                      borderColor: '#53bdeb',
                      backgroundColor: 'rgba(83, 189, 235, 0.1)',
                      tension: 0.4,
                      fill: true,
                      pointRadius: 3
                    }]
                  }}
                  options={lineChartOptions}
                />
              </div>
            </div>
          </FadeInSection>

          {/* Card 3: Historic Streak */}
          <FadeInSection delay="0.3s">
            <div className={styles.exampleCard}>
              <div className={styles.exampleEmoji}>🏆</div>
              <h3>La Chapa Histórica</h3>
              <p>"¿Quién escribió 50 mensajes seguidos sin respuesta? Descubre el monólogo más largo de la historia de tu grupo."</p>
              <div className={styles.mockWidget}>
                <div className={styles.miniStreak}>
                  <div className={styles.msIcon}>🥇</div>
                  <div className={styles.msContent}>
                    <span className={styles.msAuthor}>Ana</span>
                    <span className={styles.msCount}>47 mensajes</span>
                    <span className={styles.msTime}>14 min seguidos</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Card 4: Curiosities */}
          <FadeInSection delay="0.4s">
            <div className={styles.exampleCard}>
              <div className={styles.exampleEmoji}>⚡</div>
              <h3>Datos Curiosos</h3>
              <p>"Estadísticas rápidas que te sorprenderán. Desde cuántos días habéis hablado hasta el total de palabras."</p>
              <div className={`${styles.mockWidget} ${styles.kpiWidget}`}>
                <div className={styles.miniKpi}>
                  <span className={styles.mkValue}>12k</span>
                  <span className="mk-label">Mensajes</span>
                </div>
                <div className={styles.miniKpi}>
                  <span className={styles.mkValue}>😳</span>
                  <span className="mk-label">Top Emoji</span>
                  <span className={styles.mkSub}>Marta</span>
                </div>
                <div className={styles.miniKpi}>
                  <span className={styles.mkValue}>842</span>
                  <span className="mk-label">Audios</span>
                </div>
              </div>
            </div>
          </FadeInSection>

        </div>
      </div>

      <div className={styles.section}>
        <FadeInSection>
          <h2 className={styles.sectionTitle}>¿Por qué usar Chat Insights?</h2>
        </FadeInSection>
        <div className={styles.grid}>
          <FadeInSection delay="0.1s">
            <div className={styles.featureCard}>
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Privacidad Total</h3>
              <p>El análisis se realiza en tu navegador. Ningún dato se envía a ninguń servidor.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay="0.2s">
            <div className={styles.featureCard}>
              <div className="feature-icon">
                <BarChart2 size={32} />
              </div>
              <h3>Estadísticas Detalladas</h3>
              <p>Descubre quién habla más, horarios más activos y patrones de conversación.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay="0.3s">
            <div className={styles.featureCard}>
              <div className="feature-icon">
                <MessageSquare size={32} />
              </div>
              <h3>Análisis de Sentimiento</h3>
              <p>Entiende la dinámica de tus chats, desde los más divertidos hasta los más intensos.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay="0.4s">
            <div className={styles.featureCard}>
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Rápido y Fácil</h3>
              <p>Solo exporta tu chat desde WhatsApp y arrastra el archivo. Resultados en segundos.</p>
            </div>
          </FadeInSection>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Whatsapp Chat Insights. No afiliado oficial de WhatsApp Inc.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
