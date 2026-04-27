import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { 
  Shield, 
  Cpu, 
  Zap, 
  Cloud, 
  ChevronRight, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Users,
  Monitor
} from 'lucide-react';

// Firebase configuration
const firebaseConfig =  {
apiKey: "AIzaSyCGnQM63PVS7Z4OS2COYMD6mjZQgzGLFcQ",
authDomain: "[eventos-sibi.firebaseapp.com](http://eventos-sibi.firebaseapp.com/)",
projectId: "eventos-sibi",
storageBucket: "eventos-sibi.firebasestorage.app",
messagingSenderId: "924061588981",
appId: "1:924061588981:web:a9c3e578a16dd8214594bc",
measurementId: "G-6YX770VVDR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'grundfos-sibi-event';

export default function App() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    cargo: '',
    telefono: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [registrations, setRegistrations] = useState([]);

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Sync Registrations (for admin view/confirmation)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'registrations'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(data);
    }, (error) => console.error("Firestore error:", error));
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'registrations'), {
        ...formData,
        timestamp: serverTimestamp(),
        userId: user.uid
      });
	  
  // Enviar a Google Sheets
	const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrsQyCfYYewOb8T_wlWw6KijYGnA7V99QjvqAJcHGBF2e9EB_UYJtP7wLyzZXuITDC1A/exec';
    
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Importante para evitar problemas de dominios cruzados
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  
  
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation / Header */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="h-10 w-24 bg-slate-200 rounded flex items-center justify-center font-bold text-xs uppercase tracking-widest text-slate-500">SIBI</div>
            <div className="h-[2px] w-8 bg-slate-300 hidden md:block"></div>
            <div className="h-10 w-32 bg-[#003366] rounded flex items-center justify-center text-white font-bold text-xs">GRUNDFOS</div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-semibold uppercase tracking-wider text-slate-600">
            <span className="hover:text-[#003366] cursor-pointer transition-colors">Tecnología</span>
            <span className="hover:text-[#003366] cursor-pointer transition-colors">Programa</span>
            <span className="hover:text-[#003366] cursor-pointer transition-colors">Logística</span>
          </div>
          <a href="#register" className="bg-[#003366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#004d99] transition-all shadow-lg shadow-blue-900/20">
            SOLICITAR INVITACIÓN
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100 -z-10 clip-diagonal hidden lg:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#003366] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
              <Award size={16} /> Exclusivo para Líderes de Ingeniería
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#003366] leading-tight">
              Ingeniería de Alto Rendimiento con Hydro MPC: <span className="text-blue-500">La Era GENIECON</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              ¿Por qué seguir especificando como hace 10 años cuando los costos operativos se han triplicado? Descubra la inteligencia que blinda su reputación técnica y reduce el 85% de los costos ocultos.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <Calendar className="text-blue-500" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Fecha</p>
                  <p className="font-bold">21 de Mayo, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <Clock className="text-blue-500" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Horario</p>
                  <p className="font-bold">11:00 a 14:00 hrs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-slate-900 p-2 flex items-center justify-between">
                <div className="flex gap-1.5 ml-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">GENIECON_UI_V1.0</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8">
                 {/* Representación visual del controlador */}
                 <div className="w-full h-full border-2 border-slate-700 rounded-lg relative flex items-center justify-center">
                    <Monitor size={64} className="text-blue-400 opacity-20 absolute" />
                    <div className="text-center">
                      <p className="text-blue-400 font-mono text-xl mb-2">98.4% EFICIENCIA</p>
                      <div className="w-48 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500"></div>
                      </div>
                      <p className="text-slate-500 text-xs mt-4 uppercase tracking-widest">Pantalla Táctil 10" - Algoritmo POPS Activo</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agitation Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                El costo de la "tecnología estándar" está devorando su rentabilidad.
              </h2>
              <p className="text-slate-400 text-lg">
                Para las constructoras, un fallo en la entrega significa garantías millonarias. Para el proyectista, un diseño ineficiente es una mancha permanente en su portafolio técnico.
              </p>
              <ul className="space-y-4">
                {[
                  "85% de los costos totales son energía y mantenimiento no planeado.",
                  "Sistemas 'armados' sin inteligencia nativa que fallan bajo presión.",
                  "Falta de conectividad predictiva que deja al edificio sin agua."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Shield className="text-blue-400" /> Respaldado por Certificaciones Globales
               </h3>
               <p className="text-slate-400 mb-8">
                 Grundfos es pionero en la entrega de EPD (Declaraciones Ambientales de Producto) y soporte directo para certificaciones LEED y BREEAM, asegurando que su proyecto cumpla con los estándares del mañana.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-blue-400">IE5</p>
                    <p className="text-xs uppercase text-slate-500">Eficiencia de Motor</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-blue-400">LEED</p>
                    <p className="text-xs uppercase text-slate-500">Soporte nativo</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution / Ejes Temáticos */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#003366]">La Inmersión Técnica</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Tres horas de transferencia de conocimiento de alto nivel diseñadas por Grundfos y SIBI. No es una charla; es una actualización de activos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-[#003366] mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Lanzamiento GENIECON</h3>
              <p className="text-slate-600">
                Primer contacto con el controlador CU 362. Pantalla táctil de 10" con algoritmos de control avanzados para una gestión total del sistema.
              </p>
            </div>

            <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">ROI Real & Motores IE5</h3>
              <p className="text-slate-600">
                Reducción del 85% en costos operativos mediante el uso de motores de imanes permanentes y el algoritmo POPS (Power Optimal Pump Sequencing).
              </p>
            </div>

            <div className="group p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 mb-6 group-hover:scale-110 transition-transform">
                <Cloud size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Resiliencia Predictiva</h3>
              <p className="text-slate-600">
                Conectividad via Grundfos Connect y la implementación del "Limp Mode" (Modo de Emergencia) para garantizar continuidad total.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-[#003366] rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={200} />
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Dinámica Estrella: Inteligencia Nativa vs. Estándar</h3>
                <p className="text-blue-100 mb-6">
                  Resolución de problemas en vivo contrastando la respuesta de un sistema genérico frente a la inteligencia adaptativa del Hydro MPC. Vea la diferencia en tiempo real.
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-400/20 px-4 py-2 rounded-lg border border-blue-400/30">
                  <CheckCircle2 size={18} /> <span>Handover de documentación vía Grundfos GO</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <p className="text-sm uppercase tracking-widest text-blue-200 mb-2">Coffee Break Incluido</p>
                  <p className="text-lg font-semibold italic">"Networking de alto nivel con especialistas y tomadores de decisiones de la industria."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-24 bg-slate-50 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-[#003366] to-[#004d99] p-10 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Solicitar Invitación Exclusiva</h2>
              <p className="text-blue-100 opacity-80">Cupos estrictamente limitados. Sujeto a confirmación por el comité organizador.</p>
            </div>
            
            {status === 'success' ? (
              <div className="p-16 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Solicitud Recibida</h3>
                <p className="text-slate-600">
                  Hemos registrado su interés. Un especialista de SIBI o Grundfos se pondrá en contacto con usted para confirmar su lugar en un plazo de 48 horas.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Registrar a otro colaborador
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Nombre Completo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej. Ing. Juan Pérez"
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Correo Corporativo</label>
                    <input 
                      required
                      type="email" 
                      placeholder="juan.perez@empresa.com"
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Empresa / Constructora</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Nombre de la compañía"
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Cargo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej. Gerente de Proyectos"
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      value={formData.cargo}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Teléfono de Contacto</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+52 ..."
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
                
                <button 
                  disabled={status === 'loading'}
                  type="submit"
                  className="w-full py-4 bg-[#003366] text-white rounded-xl font-bold text-lg hover:bg-[#004d99] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-900/20"
                >
                  {status === 'loading' ? 'Procesando...' : 'SOLICITAR MI INVITACIÓN EXCLUSIVA'}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-4">
                  Evento sin costo | Exclusivo para el sector industrial y construcción
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer / Logistics Summary */}
      <footer className="bg-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-4 grayscale opacity-70">
                <div className="h-8 w-20 bg-slate-300 rounded"></div>
                <div className="h-8 w-24 bg-[#003366] rounded"></div>
              </div>
              <p className="text-slate-500 max-w-sm text-sm">
                Un evento co-organizado por SIBI y Grundfos para elevar el estándar de la ingeniería hidráulica en la región.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs text-slate-400 tracking-widest">Ubicación</h4>
              <div className="flex gap-2 items-start text-slate-700">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span className="text-sm">Calle Independencia 321, Centro, 45500 San Pedro Tlaquepaque, Jal.</span>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs text-slate-400 tracking-widest">Contacto Directo</h4>
              <p className="text-sm text-slate-700 font-medium">ventas@sibi.mx</p>
              <p className="text-sm text-slate-700 font-medium">+52 (33) 4302-9006</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Panel (Simulation for Leads) */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-slate-900 text-white p-3 rounded-full shadow-2xl flex items-center gap-2 text-xs border border-slate-700 cursor-help group relative">
          <Users size={14} />
          <span>{registrations.length} Solicitudes</span>
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white text-slate-900 p-4 rounded-xl shadow-2xl border border-slate-200 hidden group-hover:block transition-all">
             <p className="font-bold mb-2 border-b pb-2">Registro de Leads (Real-time)</p>
             <div className="max-h-40 overflow-y-auto space-y-2">
                {registrations.map(reg => (
                  <div key={reg.id} className="text-[10px] border-b border-slate-50 pb-1">
                    <strong>{reg.nombre}</strong> - {reg.empresa}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}