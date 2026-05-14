import type { User, Mentor, Session, Review } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Jonathan Gutierrez', email: 'jonathan@certus.edu.pe', role: 'aprendiz', cycle: '3er', avatar: 'JG', status: 'active', sessions: 12 },
  { id: 'u2', name: 'Ana Lucía Paredes', email: 'ana.paredes@certus.edu.pe', role: 'mentor', cycle: '8vo', avatar: 'AL', status: 'active', sessions: 47 },
  { id: 'u3', name: 'Carlos Mendoza Ríos', email: 'carlos.mendoza@certus.edu.pe', role: 'mentor', cycle: '7mo', avatar: 'CM', status: 'active', sessions: 35 },
  { id: 'u4', name: 'Valeria Torres Ccallo', email: 'valeria.torres@certus.edu.pe', role: 'mentor', cycle: '9no', avatar: 'VT', status: 'active', sessions: 28 },
  { id: 'u5', name: 'Diego Quispe Mamani', email: 'diego.quispe@certus.edu.pe', role: 'mentor', cycle: '8vo', avatar: 'DQ', status: 'active', sessions: 52 },
  { id: 'u6', name: 'Sofía Ramírez Flores', email: 'sofia.ramirez@certus.edu.pe', role: 'mentor', cycle: '7mo', avatar: 'SR', status: 'active', sessions: 19 },
  { id: 'u7', name: 'Mateo Flores Condori', email: 'mateo.flores@certus.edu.pe', role: 'mentor', cycle: '9no', avatar: 'MF', status: 'suspended', sessions: 41 },
  { id: 'admin1', name: 'Prof. Lucía Benavides', email: 'admin@certus.edu.pe', role: 'admin', cycle: '—', avatar: 'LB', status: 'active', sessions: 0 },
  { id: 'u8', name: 'Rodrigo Salas Huanca', email: 'rodrigo.salas@certus.edu.pe', role: 'aprendiz', cycle: '2do', avatar: 'RS', status: 'active', sessions: 5 },
  { id: 'u9', name: 'Camila Vega Torres', email: 'camila.vega@certus.edu.pe', role: 'aprendiz', cycle: '4to', avatar: 'CV', status: 'active', sessions: 8 },
];

export const mentors: Mentor[] = [
  {
    userId: 'u2',
    specialty: 'Diseño UX/UI',
    tags: ['Figma', 'Prototipado', 'User Research', 'Design Systems'],
    rating: 4.9,
    totalSessions: 47,
    available: true,
    responseTime: '< 2 horas',
    bio: 'Estudiante del 8vo ciclo especializada en UX Research y diseño de interfaces. He trabajado en proyectos freelance para 3 startups arequipeñas y puedo guiarte desde los fundamentos del diseño hasta la entrega de prototipos funcionales listos para desarrollo.',
  },
  {
    userId: 'u3',
    specialty: 'Desarrollo Web',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    rating: 4.8,
    totalSessions: 35,
    available: true,
    responseTime: '< 3 horas',
    bio: 'Del 7mo ciclo, con experiencia en desarrollo fullstack. He construido 5 proyectos propios con React y Node.js. Me especializo en ayudar a estudiantes que están iniciando en programación web.',
  },
  {
    userId: 'u4',
    specialty: 'Marketing Digital',
    tags: ['SEO', 'Google Ads', 'Meta Ads', 'Analytics'],
    rating: 4.7,
    totalSessions: 28,
    available: false,
    responseTime: '< 4 horas',
    bio: '9no ciclo, con certificaciones en Google y Meta Ads. Actualmente trabajo part-time en una agencia digital y puedo ayudarte a entender el ecosistema del marketing digital desde una perspectiva práctica.',
  },
  {
    userId: 'u5',
    specialty: 'Base de Datos',
    tags: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
    rating: 4.9,
    totalSessions: 52,
    available: true,
    responseTime: '< 1 hora',
    bio: 'El mejor del 8vo ciclo en BD. Domino modelado relacional, consultas complejas, optimización y NoSQL. He resuelto más de 200 consultas académicas y puedo ayudarte a entender desde MER hasta índices avanzados.',
  },
  {
    userId: 'u6',
    specialty: 'Programación',
    tags: ['Python', 'Java', 'Algoritmos', 'Estructuras de Datos'],
    rating: 4.6,
    totalSessions: 19,
    available: true,
    responseTime: '< 2 horas',
    bio: '7mo ciclo, apasionada por los algoritmos y la lógica de programación. Puedo ayudarte con Python, Java, análisis de complejidad y estructuras de datos. Muy buena explicando conceptos difíciles de forma simple.',
  },
  {
    userId: 'u7',
    specialty: 'Gestión de Proyectos TI',
    tags: ['Scrum', 'ITIL', 'PMI', 'Jira'],
    rating: 4.8,
    totalSessions: 41,
    available: false,
    responseTime: '< 3 horas',
    bio: '9no ciclo con certificación Scrum Master. Trabajo como PM junior en una empresa de software y puedo enseñarte gestión ágil, ITIL y las herramientas que usan las empresas reales en Arequipa y Lima.',
  },
];

export const sessions: Session[] = [
  { id: 's1', mentorId: 'u2', apprenticeId: 'u1', topic: 'Prototipado en Figma — Flujos de usuario y componentes', date: '2026-05-08', time: '16:00', duration: 45, status: 'completed', type: 'videocall' },
  { id: 's2', mentorId: 'u3', apprenticeId: 'u1', topic: 'React Hooks — useEffect, estado asíncrono y optimización', date: '2026-05-12', time: '10:00', duration: 60, status: 'upcoming', type: 'videocall' },
  { id: 's3', mentorId: 'u5', apprenticeId: 'u1', topic: 'Modelado Entidad-Relación y normalización de tablas', date: '2026-05-15', time: '15:00', duration: 45, status: 'pending', type: 'videocall' },
  { id: 's4', mentorId: 'u2', apprenticeId: 'u1', topic: 'Design Systems y tokens de diseño en Figma', date: '2026-04-28', time: '14:00', duration: 60, status: 'completed', type: 'videocall' },
  { id: 's5', mentorId: 'u6', apprenticeId: 'u1', topic: 'Estructuras de datos — Árboles y grafos con Python', date: '2026-05-14', time: '11:00', duration: 60, status: 'upcoming', type: 'videocall' },
  { id: 's6', mentorId: 'u3', apprenticeId: 'u8', topic: 'Introducción a Next.js y App Router', date: '2026-05-13', time: '09:00', duration: 45, status: 'upcoming', type: 'videocall' },
];

export const reviews: Review[] = [
  { id: 'r1', sessionId: 's1', mentorId: 'u2', apprenticeId: 'u1', rating: 5, comment: 'Ana explica muy bien los fundamentos de UX. Aprendí a estructurar mis flujos de usuario en una sola sesión. La forma en que usa componentes en Figma es profesional. Totalmente recomendada.', clarity: 5, knowledge: 5, punctuality: 5, helpfulness: 5, date: '2026-05-08' },
  { id: 'r2', sessionId: 's4', mentorId: 'u2', apprenticeId: 'u1', rating: 5, comment: 'Excelente sesión. Me ayudó a entender cómo estructurar un Design System desde cero para mi proyecto de tesis. Muy clara y organizada.', clarity: 5, knowledge: 5, punctuality: 4, helpfulness: 5, date: '2026-04-28' },
  { id: 'r3', sessionId: 's6', mentorId: 'u3', apprenticeId: 'u8', rating: 4, comment: 'Carlos tiene mucho conocimiento técnico. La sesión fue muy práctica. Solo le faltó un poco más de paciencia con mis preguntas básicas.', clarity: 4, knowledge: 5, punctuality: 5, helpfulness: 4, date: '2026-04-30' },
];

export const pendingApprovals = [
  { id: 'pa1', userId: 'new1', name: 'Fernanda Chávez López', type: 'Solicitud de Mentor', avatar: 'FC', date: '2026-05-10' },
  { id: 'pa2', userId: 'new2', name: 'Gonzalo Pinto Salas', type: 'Solicitud de Mentor', avatar: 'GP', date: '2026-05-11' },
  { id: 'pa3', userId: 'new3', name: 'Milagros Quispe Apaza', type: 'Actualización de Perfil', avatar: 'MQ', date: '2026-05-11' },
];

export const db = {
  users,
  mentors,
  sessions,
  reviews,
};
