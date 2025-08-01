import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import './PricingPage.css';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('diagram');
  const [showPriceBlue, setShowPriceBlue] = useState(false);
  const [showPriceOrange, setShowPriceOrange] = useState(false);
  const [showPriceGreen, setShowPriceGreen] = useState(false);
  const [showModalityModal, setShowModalityModal] = useState(false);

  useEffect(() => {
    // Crear partículas en el header
    const header = document.querySelector('.pricing-header');
    if (!header) return;

    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    
    function createParticle() {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = '100%';
      particle.style.opacity = '0.7';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '0';
      
      header.appendChild(particle);
      
      const duration = 3000 + Math.random() * 2000;
      const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: 0.7 },
        { transform: `translateY(-${header.clientHeight + 50}px)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'linear'
      });
      
      animation.onfinish = () => particle.remove();
    }
    
    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pricing-container">
      <div className="pricing-content">
        <div className="pricing-header">
          <h1>Sistema de Gestión Integral</h1>
          <p>El Patio de Mi Casa - Arquitectura del Sistema</p>
        </div>
        
        <div className="pricing-tabs">
          <button 
            className={`pricing-tab-button ${activeTab === 'diagram' ? 'active' : ''}`} 
            onClick={() => setActiveTab('diagram')}
          >
            Diagrama del Sistema
          </button>
          <button 
            className={`pricing-tab-button ${activeTab === 'costs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('costs')}
          >
            Análisis de Costos
          </button>
        </div>
        
        <div className={`pricing-tab-content ${activeTab === 'diagram' ? 'active' : ''}`}>
          <div className="pricing-diagram-grid">
            {/* INPUTS */}
            <div className="pricing-section pricing-inputs">
              <div className="pricing-section-title">
                INPUTS (Entradas)
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Datos de Estudiantes</div>
                <div className="pricing-item-content">Información personal (nombre, email, teléfono), nivel evaluado</div>
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Programación de Clases</div>
                <div className="pricing-item-content">Horarios, frecuencia, asignación de profesores, tipo de clase (individual/grupal/prueba)</div>
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Transacciones Financieras</div>
                <div className="pricing-item-content">Compra de paquetes de créditos (5, 10, 20, 50), métodos de pago</div>
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Gestión Académica</div>
                <div className="pricing-item-content">Evaluaciones de nivel, asistencia, cancelaciones y reprogramaciones</div>
              </div>
            </div>

            {/* PROCESSES */}
            <div className="pricing-section pricing-processes">
              <div className="pricing-section-title">
                PROCESOS PRINCIPALES
              </div>
              
              <div className="pricing-process-flow">
                <div className="pricing-process-step">
                  <h4>1. Proceso de Inscripción</h4>
                  <p>Registro de nuevos estudiantes, evaluación de nivel inicial y asignación a grupos</p>
                </div>
                
                <div className="pricing-process-step">
                  <h4>2. Gestión de Clases</h4>
                  <p>Programación automática, control de asistencia y gestión de grupos pequeños (máx. 4 estudiantes)</p>
                </div>
                
                <div className="pricing-process-step">
                  <h4>3. Sistema de Créditos</h4>
                  <p>Administración de paquetes, consumo por clase y renovaciones automáticas</p>
                </div>
                
                <div className="pricing-process-step">
                  <h4>4. Progresión Académica</h4>
                  <p>Seguimiento del progreso, evaluaciones periódicas y certificaciones</p>
                </div>
                
                <div className="pricing-process-step">
                  <h4>5. Flujo Financiero</h4>
                  <p>Procesamiento de pagos, facturación automática y reportes de ingresos</p>
                </div>
              </div>
            </div>

            {/* OUTPUTS */}
            <div className="pricing-section pricing-outputs">
              <div className="pricing-section-title">
                OUTPUTS (Salidas)
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Documentos Generados</div>
                <div className="pricing-item-content">Facturas PDF profesionales, calendarios exportables, certificados de inscripción</div>
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Visualizaciones y Métricas</div>
                <div className="pricing-item-content">Dashboard con KPIs en tiempo real, gráficos de tendencias, calendario visual</div>
              </div>
              
              <div className="pricing-item">
                <div className="pricing-item-title">Notificaciones</div>
                <div className="pricing-item-content">Confirmaciones por email/SMS, recordatorios de renovación, avisos de cancelación</div>
              </div>
            </div>
          </div>

          {/* ROLES */}
          <div className="pricing-section pricing-roles">
            <div className="pricing-section-title">
              ROLES DEL SISTEMA
            </div>
            
            <div className="pricing-role-grid">
              <div className="pricing-role-card">
                <div className="pricing-role-title">Administrador General</div>
                <ul className="pricing-role-permissions">
                  <li>Control total del sistema</li>
                  <li>Gestión de usuarios y configuraciones</li>
                  <li>Acceso a módulos financieros</li>
                  <li>Reportes completos</li>
                </ul>
              </div>
              
              <div className="pricing-role-card">
                <div className="pricing-role-title">Coordinador Académico</div>
                <ul className="pricing-role-permissions">
                  <li>Gestión de programas académicos</li>
                  <li>Asignación de profesores y estudiantes</li>
                  <li>Programación de clases</li>
                  <li>Sin acceso a módulo de usuarios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={`pricing-tab-content ${activeTab === 'costs' ? 'active' : ''}`}>
          <div className="pricing-cost-section">
            <div className="pricing-cost-header">
              <h2>Análisis de Costos del Proyecto</h2>
              <p>Opciones de entrega y mantenimiento para el proyecto</p>
            </div>

            <div className="pricing-models-grid">
              {/* Modelo Código Completo */}
              <div className="pricing-model-card pricing-blue">
                {!showPriceBlue ? (
                  <div className="pricing-main-view" style={{ padding: '25px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '0 0 auto' }}>
                      <div className="pricing-model-icon"></div>
                      <h3 className="pricing-model-title">Entrega de Código Completo</h3>
                      <p className="pricing-model-description">
                        Se entrega el código fuente completo del proyecto. El cliente 
                        asume total responsabilidad de la gestión, disponibilidad y mantenimiento.
                      </p>
                      <ul className="pricing-model-features">
                        <li>Propiedad total del código</li>
                        <li>Autonomía completa del cliente</li>
                        <li>Sin dependencias futuras</li>
                        <li>Documentación técnica incluida</li>
                      </ul>
                    </div>
                    
                    <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                      <div className="pricing-model-example" style={{ margin: '15px 0' }}>
                        <strong>No incluye:</strong>
                        <ul style={{ marginTop: '10px', listStyle: 'none', padding: 0 }}>
                          <li style={{ marginBottom: '5px', paddingLeft: 0, fontSize: '0.9em' }}>• <strong>Infraestructura</strong> (hosting, disponibilidad)</li>
                          <li style={{ marginBottom: '5px', paddingLeft: 0, fontSize: '0.9em' }}>• <strong>Actualizaciones técnicas</strong></li>
                          <li style={{ marginBottom: '5px', paddingLeft: 0, fontSize: '0.9em' }}>• <strong>Corrección de errores</strong></li>
                          <li style={{ marginBottom: '5px', paddingLeft: 0, fontSize: '0.9em' }}>• <strong>Seguridad y monitoreo</strong></li>
                          <li style={{ marginBottom: '5px', paddingLeft: 0, fontSize: '0.9em' }}>• <strong>Escalabilidad futura</strong></li>
                        </ul>
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '30px 0', flex: '0 0 auto', marginTop: '20px' }}>
                        <button className="pricing-price-btn-blue" onClick={() => setShowPriceBlue(true)}>Ver Precio</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pricing-price-view" style={{ padding: '25px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ textAlign: 'center', fontSize: '1.4em', marginBottom: '30px', color: 'var(--secondary-blue)', fontWeight: 600 }}>Precio del Proyecto</h3>
                      
                      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '15px', padding: '40px', marginBottom: '30px' }}>
                        <div style={{ fontSize: '1.2em', marginBottom: '15px', opacity: 0.8 }}>Desarrollo Completo + Código Fuente</div>
                        <div style={{ fontSize: '3em', fontWeight: 700, color: 'var(--secondary-blue)', marginBottom: '10px' }}>$58,000</div>
                        <div style={{ fontSize: '1em', opacity: 0.8 }}>Pago único - Sin costos adicionales</div>
                      </div>
                      
                      <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button onClick={() => setShowPriceBlue(false)} className="pricing-back-btn" style={{ color: 'var(--secondary-blue)', borderColor: 'var(--secondary-blue)' }}>Volver</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modelo Software + Instalación */}
              <div className="pricing-model-card pricing-orange">
                {!showPriceOrange ? (
                  <div className="pricing-main-view" style={{ padding: '25px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '0 0 auto' }}>
                      <div className="pricing-model-icon"></div>
                      <h3 className="pricing-model-title">Software + Instalación</h3>
                      <p className="pricing-model-description">
                        Se vende el software completamente funcional junto con su instalación 
                        en los servidores del cliente. Sin servicios de mantenimiento posteriores.
                      </p>
                      <ul className="pricing-model-features">
                        <li>Instalación profesional incluida</li>
                        <li>Software listo para usar</li>
                        <li>Capacitación básica incluida</li>
                        <li>Sin costos recurrentes</li>
                      </ul>
                    </div>
                    
                    <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                      <div className="pricing-model-example" style={{ margin: '15px 0', fontSize: '0.85em', lineHeight: '1.4' }}>
                        El cliente recibe el software completamente funcional y configurado en su infraestructura. <strong>Incluye instalación profesional y capacitación inicial</strong> para que el equipo pueda operarlo de manera autónoma.<br /><br />
                        <strong>Ideal para organizaciones que tienen su propio equipo técnico</strong> y prefieren gestionar el sistema internamente.
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '30px 0', flex: '0 0 auto', marginTop: '20px' }}>
                        <button className="pricing-price-btn-orange" onClick={() => setShowPriceOrange(true)}>Ver Precio</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pricing-price-view" style={{ padding: '25px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ textAlign: 'center', fontSize: '1.4em', marginBottom: '30px', color: 'var(--accent-orange)', fontWeight: 600 }}>Precio del Proyecto</h3>
                      
                      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '15px', padding: '40px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '1.2em', marginBottom: '15px', opacity: 0.8 }}>Software + Instalación Profesional</div>
                        <div style={{ fontSize: '3em', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '10px' }}>$65,000</div>
                        <div style={{ fontSize: '1em', opacity: 0.8 }}>Pago único - Todo incluido</div>
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.9em', opacity: 0.8 }}>💼 <strong>Precio premium</strong> - Instalación profesional</div>
                        <div style={{ fontSize: '0.85em', opacity: 0.7 }}>Software listo para usar + capacitación</div>
                      </div>
                      
                      <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button onClick={() => setShowPriceOrange(false)} className="pricing-back-btn" style={{ color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)' }}>Volver</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modelo Software + Mantenimiento */}
              <div className="pricing-model-card pricing-green">
                {!showPriceGreen ? (
                  <div className="pricing-main-view" style={{ padding: '25px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '0 0 auto' }}>
                      <div className="pricing-model-icon">✓</div>
                      <h3 className="pricing-model-title">Solución integral: desarrollo, mantenimiento y gestión técnica</h3>
                      <p className="pricing-model-description">
                        Se vende el software con servicio completo de mantenimiento. Nosotros 
                        nos encargamos de que todo funcione correctamente de forma continua.
                      </p>
                      <ul className="pricing-model-features">
                        <li>Pago inicial + Mensualidad</li>
                        <li>Soporte técnico 24/7</li>
                        <li>Actualizaciones incluidas</li>
                        <li>Gestión completa del sistema</li>
                        <li>Hosting y mantenimiento incluido</li>
                      </ul>
                    </div>
                    
                    <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                      <div className="pricing-model-example" style={{ fontSize: '0.85em', lineHeight: '1.4', margin: '15px 0' }}>
                        Se entrega el software completamente funcional <strong>junto con un servicio continuo de mantenimiento técnico</strong>.<br /><br />
                        Nos encargamos de que <strong>todo funcione correctamente en todo momento</strong>: monitoreamos, actualizamos y aseguramos el buen rendimiento del sistema.<br /><br />
                        Esto incluye la <strong>gestión completa del hosting, base de datos, respaldo, disponibilidad y rendimiento</strong>, para que el cliente no tenga que preocuparse por aspectos técnicos.
                      </div>
                      
                      <div style={{ textAlign: 'center', padding: '30px 0', flex: '0 0 auto', marginTop: '20px' }}>
                        <button className="pricing-price-btn-green" onClick={() => setShowPriceGreen(true)}>Ver Precios Detallados</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pricing-price-view" style={{ padding: '25px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ textAlign: 'center', fontSize: '1.4em', marginBottom: '30px', color: 'var(--primary-green)', fontWeight: 600 }}>Desglose de Precios</h3>
                      
                      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '15px', padding: '40px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(45, 90, 61, 0.2)' }}>
                          <span style={{ fontSize: '0.95em' }}>Infraestructura (mensual)</span>
                          <span style={{ fontWeight: 600, color: 'var(--primary-green)' }}>$800</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(45, 90, 61, 0.2)' }}>
                          <span style={{ fontSize: '0.95em' }}>Mantenimiento (mensual)</span>
                          <span style={{ fontWeight: 600, color: 'var(--primary-green)' }}>$1,600</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.1em', marginTop: '10px', paddingTop: '15px', borderTop: '2px solid var(--primary-green)', marginBottom: 0 }}>
                          <span>Total Mensual</span>
                          <span style={{ color: 'var(--primary-green)' }}>$2,400/mes</span>
                        </div>
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '15px', padding: '15px', marginBottom: '30px' }}>
                        <div style={{ fontSize: '1em', marginBottom: '5px' }}><strong>Desarrollo Inicial:</strong></div>
                        <div style={{ fontSize: '1.5em', fontWeight: 700, color: 'var(--primary-green)' }}>$40,000</div>
                        <div style={{ fontSize: '0.85em', opacity: 0.8 }}>Pago único por el desarrollo completo</div>
                      </div>
                      
                      <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button onClick={() => setShowPriceGreen(false)} className="pricing-back-btn" style={{ color: 'var(--primary-green)', borderColor: 'var(--primary-green)' }}>Volver</button>
                        <button onClick={() => setShowModalityModal(true)} className="pricing-price-btn-green" style={{ marginTop: '10px' }}>Ver Modalidades de Desarrollo</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showModalityModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModalityModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              color: '#333',
              fontSize: '2em'
            }}>
              Modalidades de Desarrollo
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{
                border: '2px solid var(--primary-green)',
                borderRadius: '15px',
                padding: '30px',
                backgroundColor: '#f9f9f9'
              }}>
                <h3 style={{ 
                  color: 'var(--primary-green)', 
                  marginBottom: '20px',
                  fontSize: '1.5em'
                }}>
                  Modalidad Desarrollo a 3 Meses
                </h3>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    $40,000
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                    Pago inicial para desarrollo
                  </div>
                </div>
                
                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ color: '#333', marginBottom: '20px', fontSize: '1.2em' }}>
                    Roadmap de Pagos - 3 Meses
                  </h4>
                  <div style={{ position: 'relative', paddingLeft: '20px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '10px',
                      bottom: '10px',
                      width: '2px',
                      backgroundColor: 'var(--primary-green)',
                      opacity: '0.3'
                    }}></div>
                    
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 1 - Inicio
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                        $12,000 (30%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Firma de contrato y arranque del proyecto
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 2 - Avance 50%
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                        
                        $12,000 (30%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Entrega de módulos principales
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '0', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 3 - Entrega Final
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                      $16,000 (40%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Proyecto completo y funcionando
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                border: '2px solid var(--primary-green)',
                borderRadius: '15px',
                padding: '30px',
                backgroundColor: '#f9f9f9'
              }}>
                <h3 style={{ 
                  color: 'var(--primary-green)', 
                  marginBottom: '20px',
                  fontSize: '1.5em'
                }}>
                  Modalidad Desarrollo a 4 Meses
                </h3>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    $40,000
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                    Pago inicial para desarrollo
                  </div>
                </div>
                
                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ color: '#333', marginBottom: '20px', fontSize: '1.2em' }}>
                    Roadmap de Pagos - 4 Meses
                  </h4>
                  <div style={{ position: 'relative', paddingLeft: '20px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '10px',
                      bottom: '10px',
                      width: '2px',
                      backgroundColor: 'var(--primary-green)',
                      opacity: '0.3'
                    }}></div>
                    
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 1 - Inicio
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                        $8,000 (20%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Firma de contrato y análisis detallado
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 2 - Primera entrega
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                        $10,000 (25%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Módulos base completados
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 3 - Segunda entrega
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                        $10,000 (25%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Funcionalidades avanzadas
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '0', position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-green)',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px var(--primary-green)'
                      }}></div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '5px' }}>
                        Mes 4 - Entrega Final
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
                        $12,000 (30%)
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>
                        Optimización y entrega completa
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}