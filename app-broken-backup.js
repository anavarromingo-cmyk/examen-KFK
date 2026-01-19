// ===================================
// Firebase Integration & Constants
// ===================================

import { db, auth } from './firebase-config.js';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
    where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Admin email for Firebase Authentication
const ADMIN_EMAIL = 'admin@kifull.com';


// Exercise definitions with descriptions
const EXERCISES = [
    {
        id: 'mae-geri',
        name: 'Mae Geri',
        fullName: 'Mae Geri (Patada Frontal)',
        description: 'Patada frontal fundamental ejecutada levantando la rodilla y extendiendo la pierna hacia adelante'
    },
    {
        id: 'mawashi-geri',
        name: 'Mawashi Geri',
        fullName: 'Mawashi Geri (Patada Circular)',
        description: 'Patada circular ejecutada girando el pie de apoyo y golpeando con el metatarso'
    },
    {
        id: 'yoko-geri',
        name: 'Yoko Geri',
        fullName: 'Yoko Geri (Patada Lateral)',
        description: 'Patada lateral rápida de movimiento pendular con el filo del pie'
    },
    {
        id: 'ura-mawashi-geri',
        name: 'Ura Mawashi Geri',
        fullName: 'Ura Mawashi Geri (Gancho)',
        description: 'Patada circular inversa que describe una trayectoria de gancho de adentro hacia afuera'
    },
    {
        id: 'ushiro-geri',
        name: 'Ushiro Geri',
        fullName: 'Ushiro Geri (Patada Hacia Atrás)',
        description: 'Patada hacia atrás ejecutada levantando la rodilla y mirando por encima del hombro'
    },
    {
        id: 'ushiro-mawashi-geri',
        name: 'Ushiro Mawashi Geri',
        fullName: 'Ushiro Mawashi Geri (Circular con Giro)',
        description: 'Patada circular con rotación completa del cuerpo para generar impacto devastador'
    },
    {
        id: 'mawashi-uchi-keage',
        name: 'Mawashi Uchi Keage',
        fullName: 'Mawashi Uchi Keage (Circular Ascendente Interior)',
        description: 'Patada circular ascendente realizada de adentro hacia afuera'
    },
    {
        id: 'mawashi-soto-keage',
        name: 'Mawashi Soto Keage',
        fullName: 'Mawashi Soto Keage (Circular Ascendente Exterior)',
        description: 'Patada circular ascendente de fuera hacia dentro'
    },
    {
        id: 'kakato-geri',
        name: 'Kakato Geri',
        fullName: 'Kakato Geri (Patada con Talón)',
        description: 'Técnica que utiliza el talón para golpear objetivos bajos como rodilla o muslo'
    },
    {
        id: 'lock-kick',
        name: 'Lock Kick',
        fullName: 'Lock Kick',
        description: 'Patada dirigida a las articulaciones para inmovilizar o dañar'
    }
];

// Belt requirements (repetitions per leg)
const BELT_REQUIREMENTS = {
    'amarillo': {
        'mae-geri': 1000,
        'mawashi-geri': 1000,
        'yoko-geri': 1000,
        'ura-mawashi-geri': 1000,
        'ushiro-geri': 500,
        'ushiro-mawashi-geri': 500,
        'mawashi-uchi-keage': 500,
        'mawashi-soto-keage': 500,
        'kakato-geri': 500,
        'lock-kick': 500
    },
    'naranja': {
        'mae-geri': 2000,
        'mawashi-geri': 2000,
        'yoko-geri': 2000,
        'ura-mawashi-geri': 2000,
        'ushiro-geri': 1000,
        'ushiro-mawashi-geri': 1000,
        'mawashi-uchi-keage': 1000,
        'mawashi-soto-keage': 1000,
        'kakato-geri': 1000,
        'lock-kick': 1000
    },
    'verde': {
        'mae-geri': 3000,
        'mawashi-geri': 3000,
        'yoko-geri': 3000,
        'ura-mawashi-geri': 3000,
        'ushiro-geri': 2000,
        'ushiro-mawashi-geri': 2000,
        'mawashi-uchi-keage': 2000,
        'mawashi-soto-keage': 2000,
        'kakato-geri': 2000,
        'lock-kick': 2000
    },
    'azul': {
        'mae-geri': 4000,
        'mawashi-geri': 4000,
        'yoko-geri': 4000,
        'ura-mawashi-geri': 4000,
        'ushiro-geri': 4000,
        'ushiro-mawashi-geri': 4000,
        'mawashi-uchi-keage': 4000,
        'mawashi-soto-keage': 4000,
        'kakato-geri': 4000,
        'lock-kick': 4000
    },
    'marron': {
        'mae-geri': 6000,
        'mawashi-geri': 6000,
        'yoko-geri': 6000,
        'ura-mawashi-geri': 6000,
        'ushiro-geri': 6000,
        'ushiro-mawashi-geri': 6000,
        'mawashi-uchi-keage': 6000,
        'mawashi-soto-keage': 6000,
        'kakato-geri': 6000,
        'lock-kick': 6000
    },
    'negro': {
        'mae-geri': 7200, // 2 horas estimadas (asumiendo ~60 repeticiones/minuto)
        'mawashi-geri': 7200,
        'yoko-geri': 7200,
        'ura-mawashi-geri': 7200,
        'ushiro-geri': 7200,
        'ushiro-mawashi-geri': 7200,
        'mawashi-uchi-keage': 7200,
        'mawashi-soto-keage': 7200,
        'kakato-geri': 7200,
        'lock-kick': 7200
    },
    'negro-2dan': {
        'mae-geri': 12000,
        'mawashi-geri': 12000,
        'yoko-geri': 12000,
        'ura-mawashi-geri': 12000,
        'ushiro-geri': 12000,
        'ushiro-mawashi-geri': 12000,
        'mawashi-uchi-keage': 12000,
        'mawashi-soto-keage': 12000,
        'kakato-geri': 12000,
        'lock-kick': 12000
    }
};

// Belt emoji mapping
const BELT_EMOJIS = {
    'amarillo': '🟡',
    'naranja': '🟠',
    'verde': '🟢',
    'azul': '🔵',
    'marron': '🟤',
    'negro': '⚫',
    'negro-2dan': '🔴'
};

// Belt names for display
const BELT_NAMES = {
    'amarillo': 'Amarillo',
    'naranja': 'Naranja',
    'verde': 'Verde',
    'azul': 'Azul',
    'marron': 'Marrón',
    'negro': 'Negro (1º Dan)',
    'negro-2dan': 'Negro 2º Dan (Tigre Rojo)'
};

// ===================================
// State Management  
// ===================================

let currentStudent = null;
let allStudents = [];
let studentsUnsubscribe = null;

// Loading UI helpers
function showLoading(message = 'Cargando...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.querySelector('p').textContent = message;
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// Load students from Firestore (real-time)
function loadStudents() {
    showLoading('Cargando estudiantes...');

    const q = query(collection(db, 'students'), orderBy('fechaRegistro', 'desc'));

    studentsUnsubscribe = onSnapshot(q, (snapshot) => {
        allStudents = [];
        snapshot.forEach((doc) => {
            allStudents.push({
                firestoreId: doc.id,
                ...doc.data()
            });
        });

        // Update admin view if it's currently showing
        if (document.getElementById('adminView').classList.contains('active')) {
            renderAllStudentsProgress();
        }

        hideLoading();
    }, (error) => {
        console.error('Error loading students:', error);
        showToast('Error al cargar estudiantes');
        hideLoading();
    });
}

// Save/Update student in Firestore
async function saveStudent(student) {
    try {
        if (student.firestoreId) {
            // Update existing
            await updateDoc(doc(db, 'students', student.firestoreId), {
                ejercicios: student.ejercicios
            });
        } else {
            // Create new
            const docRef = await addDoc(collection(db, 'students'), {
                nombre: student.nombre,
                apellidos: student.apellidos,
                cinturon: student.cinturon,
                fechaRegistro: student.fechaRegistro,
                ejercicios: student.ejercicios
            });
            student.firestoreId = docRef.id;
        }
    } catch (error) {
        console.error('Error saving student:', error);
        showToast('Error al guardar datos');
    }
}

// ===================================
// Student Management
// ===================================

async function createStudent(nombre, apellidos, cinturon) {
    showLoading('Registrando estudiante...');

    const student = {
        id: Date.now(),
        nombre,
        apellidos,
        cinturon,
        fechaRegistro: new Date().toISOString(),
        ejercicios: {}
    };

    // Initialize exercises
    EXERCISES.forEach(exercise => {
        student.ejercicios[exercise.id] = {
            izquierda: { total: 0, registros: [] },
            derecha: { total: 0, registros: [] }
        };
    });

    await saveStudent(student);
    allStudents.push(student);
    hideLoading();
    return student;
}

function findStudent(id) {
    return allStudents.find(s => s.id === id);
}

// ===================================
// View Management
// ===================================

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
}

// ===================================
// Toast Notifications
// ===================================

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Registration Form
// ===================================

// ===================================
// Tab Navigation Handler
// ===================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const tabId = btn.dataset.tab;

        // Update active button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        // Show selected tab
        const selectedTab = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
        if (selectedTab) {
            selectedTab.classList.add('active');

            // Load sessions when historial tab is clicked
            if (tabId === 'historial' && currentStudent) {
                const sessions = await getStudentSessions(currentStudent.firestoreId);
                renderSessionsHistory(sessions);
            }
        }
    });
});

// ===================================
// Auth Toggle Handler
// ===================================
document.querySelectorAll('.auth-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;

        // Update active button
        document.querySelectorAll('.auth-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle forms
        if (mode === 'login') {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
        } else {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        }
    });
});

// ===================================
// Login Form Handler
// ===================================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();

    if (!email) {
        showToast('Por favor ingresa tu email');
        return;
    }

    const student = await loginStudent(email);

    if (student) {
        currentStudent = student;
        document.getElementById('studentName').textContent = `${student.nombre} ${student.apellidos}`;
        document.getElementById('studentBelt').textContent = BELT_LABELS[student.cinturon];
        document.getElementById('studentBelt').className = `belt-badge belt-${student.cinturon}`;

        renderDailyLog();
        renderProgress();

        // Load sessions
        const sessions = await getStudentSessions(student.firestoreId);
        renderSessionsHistory(sessions);

        showView('studentView');
        document.getElementById('loginEmail').value = '';
    }
});

// ===================================
// Register Form Handler 
// ===================================
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const cinturon = document.getElementById('cinturon').value;

    if (!nombre || !apellidos || !email || !cinturon) {
        showToast('Por favor completa todos los campos');
        return;
    }

    const student = await registerStudentWithEmail(nombre, apellidos, email, cinturon);

    if (student) {
        currentStudent = student;
        document.getElementById('studentName').textContent = `${student.nombre} ${student.apellidos}`;
        document.getElementById('studentBelt').textContent = BELT_LABELS[student.cinturon];
        document.getElementById('studentBelt').className = `belt-badge belt-${student.cinturon}`;

        renderDailyLog();
        renderProgress();
        renderSessionsHistory([]);

        showView('studentView');

        // Clear form
        document.getElementById('nombre').value = '';
        document.getElementById('apellidos').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('cinturon').value = '';
    }
});

// ===================================
// Student Dashboard
// ===================================

function renderStudentView() {
    if (!currentStudent) return;

    // Update header
    document.getElementById('studentName').textContent =
        `${currentStudent.nombre} ${currentStudent.apellidos}`;
    document.getElementById('studentBelt').textContent =
        `${BELT_EMOJIS[currentStudent.cinturon]} ${BELT_NAMES[currentStudent.cinturon]}`;

    // Render exercise inputs
    renderExerciseInputs();

    // Render progress
    renderProgress();
}

function renderExerciseInputs() {
    const container = document.getElementById('exerciseInputs');
    const requirements = BELT_REQUIREMENTS[currentStudent.cinturon];

    container.innerHTML = EXERCISES.map(exercise => `
        <div class="exercise-item">
            <div class="exercise-header">
                <div class="exercise-name">${exercise.fullName}</div>
                <div class="exercise-requirement">
                    Requisito: ${requirements[exercise.id].toLocaleString()} repeticiones por pierna
                </div>
            </div>
            <div class="leg-inputs">
                <div class="leg-input">
                    <label>Pierna Izquierda</label>
                    <input type="number" 
                           min="0" 
                           id="input-${exercise.id}-izquierda" 
                           placeholder="0">
                </div>
                <div class="leg-input">
                    <label>Pierna Derecha</label>
                    <input type="number" 
                           min="0" 
                           id="input-${exercise.id}-derecha" 
                           placeholder="0">
                </div>
            </div>
        </div>
    `).join('');
}

// Daily log form submission
document.getElementById('dailyLogForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fecha = new Date().toISOString();
    let totalAdded = 0;

    EXERCISES.forEach(exercise => {
        const izquierdaInput = document.getElementById(`input-${exercise.id}-izquierda`);
        const derechaInput = document.getElementById(`input-${exercise.id}-derecha`);

        const izquierda = parseInt(izquierdaInput.value) || 0;
        const derecha = parseInt(derechaInput.value) || 0;

        if (izquierda > 0 || derecha > 0) {
            repeticiones[exercise.id] = { izquierda, derecha };
            totalAdded += izquierda + derecha;
        }
    });

    if (totalAdded > 0) {
        const success = await createTrainingSession(currentStudent.firestoreId, repeticiones);

        if (success) {
            renderProgress();

            // Reload sessions if on historial tab
            const sessions = await getStudentSessions(currentStudent.firestoreId);
            renderSessionsHistory(sessions);

            // Clear form
            EXERCISES.forEach(exercise => {
                document.getElementById(`${exercise.id}-izq`).value = '';
                document.getElementById(`${exercise.id}-der`).value = '';
            });
        }
    } else {
        showToast('Por favor, ingresa al menos una repetición.');
    }
});


// ===================================
// Progress Visualization
// ===================================

function renderProgress() {
    const requirements = BELT_REQUIREMENTS[currentStudent.cinturon];

    // Calculate overall progress
    let totalCompleted = 0;
    let totalRequired = 0;

    EXERCISES.forEach(exercise => {
        const repeticiones = currentStudent.totalRepeticiones[exercise.id] || { izquierda: 0, derecha: 0 };
        const requirement = requirements[exercise.id];

        totalCompleted += (repeticiones.izquierda || 0) + (repeticiones.derecha || 0);
        totalRequired += requirement * 2; // 2 legs
    });

    const overallPercentage = totalRequired > 0
        ? Math.min(100, Math.round((totalCompleted / totalRequired) * 100))
        : 0;

    // Update overall stats
    document.getElementById('overallPercentage').textContent = `${overallPercentage}%`;
    document.getElementById('totalCompleted').textContent = totalCompleted.toLocaleString();
    document.getElementById('totalRequired').textContent = totalRequired.toLocaleString();
    document.getElementById('totalPending').textContent = Math.max(0, totalRequired - totalCompleted).toLocaleString();

    // Update progress circle
    const circle = document.getElementById('progressCircle');
    const circumference = 314;
    const offset = circumference - (overallPercentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Render exercise details
    renderProgressDetails();
}

function renderProgressDetails() {
    const container = document.getElementById('progressDetails');
    const requirements = BELT_REQUIREMENTS[currentStudent.cinturon];

    container.innerHTML = EXERCISES.map(exercise => {
                    <div class="leg-label">
                        <span>Pierna Derecha</span>
                        <span>${ejercicioData.derecha.total.toLocaleString()} / ${requirement.toLocaleString()}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${derechaPercentage}%"></div>
                    </div>
                </div >
            </div >
            `;
    }).join('');
}

// ===================================
// Admin Panel
// ===================================

document.getElementById('btnAdminAccess').addEventListener('click', () => {
    document.getElementById('adminLoginModal').classList.add('active');
});

document.getElementById('btnCancelAdmin').addEventListener('click', () => {
    document.getElementById('adminLoginModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
});

document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('adminPassword').value;

    showLoading('Autenticando...');

    try {
        // Sign in with Firebase Auth
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);

        // Login successful
        document.getElementById('adminLoginModal').classList.remove('active');
        document.getElementById('adminPassword').value = '';
        showView('adminView');
        renderAllStudentsProgress();
        hideLoading();
        showToast('Acceso concedido');
    } catch (error) {
        console.error('Authentication error:', error);
        showToast('Contraseña incorrecta');
        document.getElementById('adminPassword').value = '';
        hideLoading();
    }
});

document.getElementById('btnAdminLogout').addEventListener('click', () => {
    showView('welcomeView');
});

function renderAllStudentsProgress() {
    const container = document.getElementById('allStudentsProgress');
    const filterBelt = document.getElementById('filterBelt').value;

    let studentsToShow = allStudents;
    if (filterBelt) {
        studentsToShow = allStudents.filter(s => s.cinturon === filterBelt);
    }

    if (studentsToShow.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay estudiantes registrados para este filtro</p>';
        return;
    }

    const tableHTML = `
            < table class="students-table" >
            <thead>
                <tr>
                    <th>Estudiante</th>
                    <th>Cinturón</th>
                    <th>Progreso</th>
                    <th>Completado</th>
                    <th>Requerido</th>
                    <th>Pendiente</th>
                </tr>
            </thead>
            <tbody>
                ${studentsToShow.map(student => {
        const requirements = BELT_REQUIREMENTS[student.cinturon];
        let totalCompleted = 0;
        let totalRequired = 0;

        EXERCISES.forEach(exercise => {
            const ejercicioData = student.ejercicios[exercise.id];
            const requirement = requirements[exercise.id];

            totalCompleted += ejercicioData.izquierda.total + ejercicioData.derecha.total;
            totalRequired += requirement * 2;
        });

        const percentage = totalRequired > 0
            ? Math.min(100, Math.round((totalCompleted / totalRequired) * 100))
            : 0;

        return `
                        <tr>
                            <td>${student.nombre} ${student.apellidos}</td>
                            <td>${BELT_EMOJIS[student.cinturon]} ${BELT_NAMES[student.cinturon]}</td>
                            <td>${percentage}%</td>
                            <td>${totalCompleted.toLocaleString()}</td>
                            <td>${totalRequired.toLocaleString()}</td>
                            <td>${Math.max(0, totalRequired - totalCompleted).toLocaleString()}</td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table >
            `;

    container.innerHTML = tableHTML;
}

// Filter change event
document.getElementById('filterBelt').addEventListener('change', () => {
    renderAllStudentsProgress();
});

// ===================================
// Logout
// ===================================

document.getElementById('btnLogout').addEventListener('click', () => {
    currentStudent = null;
    showView('welcomeView');
    document.getElementById('registrationForm').reset();
});

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load students from Firestore (sets up real-time listener)
    loadStudents();
    showView('welcomeView');
});

// ===================================
// Helper Function for Progress Calculation
// ===================================
function calculateOverallProgress(student) {
    let totalCompleted = 0;
    let totalRequired = 0;

    EXERCISES.forEach(exercise => {
        const exerciseData = student.ejercicios[exercise.id] || { izquierda: 0, derecha: 0 };
        totalCompleted += (exerciseData.izquierda || 0) + (exerciseData.derecha || 0);

        const required = BELT_REQUIREMENTS[student.cinturon][exercise.id] || 0;
        totalRequired += required * 2; // Both legs
    });

    const percentage = totalRequired > 0
        ? Math.min(100, Math.round((totalCompleted / totalRequired) * 100))
        : 0;

    return {
        percentage,
        completed: totalCompleted,
        required: totalRequired,
        pending: Math.max(0, totalRequired - totalCompleted)
    };
}

// ===================================
// PDF Export Functionality
// ===================================
document.getElementById('btnDownloadPDF')?.addEventListener('click', async function () {
    if (!currentStudent) return;

    try {
        showLoading();

        // Access jsPDF from global window object
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header with logo/title
        doc.setFillColor(244, 165, 0);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(26, 26, 46);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('Ki Full Katai', 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text('Reporte de Progreso del Estudiante', 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Fecha: ${ new Date().toLocaleDateString('es-ES') } `, 105, 33, { align: 'center' });

        // Student Information
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Información del Estudiante', 14, 50);

        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.text(`Nombre: ${ currentStudent.nombre } ${ currentStudent.apellidos } `, 14, 58);

        const beltEmojis = {
            'amarillo': '🟡',
            'naranja': '🟠',
            'verde': '🟢',
            'azul': '🔵',
            'marron': '🟤',
            'negro': '⚫',
            'negro-2dan': '🔴'
        };

        const beltNames = {
            'amarillo': 'Amarillo',
            'naranja': 'Naranja',
            'verde': 'Verde',
            'azul': 'Azul',
            'marron': 'Marrón',
            'negro': 'Negro 1º Dan',
            'negro-2dan': 'Negro 2º Dan - Tigre Rojo'
        };

        doc.text(`Cinturón Objetivo: ${ beltEmojis[currentStudent.cinturon] } ${ beltNames[currentStudent.cinturon] } `, 14, 66);
        doc.text(`Fecha de Registro: ${ new Date(currentStudent.fechaRegistro).toLocaleDateString('es-ES') } `, 14, 74);

        // Progress Summary
        const progress = calculateOverallProgress(currentStudent);
        doc.setFont(undefined, 'bold');
        doc.text('Resumen de Progreso', 14, 87);

        doc.setFont(undefined, 'normal');
        doc.text(`Progreso General: ${ progress.percentage }% `, 14, 95);
        doc.text(`Total Completado: ${ progress.completed.toLocaleString('es-ES') } repeticiones`, 14, 103);
        doc.text(`Total Requerido: ${ progress.required.toLocaleString('es-ES') } repeticiones`, 14, 111);
        doc.text(`Pendiente: ${ progress.pending.toLocaleString('es-ES') } repeticiones`, 14, 119);

        // Techniques Table
        doc.setFont(undefined, 'bold');
        doc.text('Progreso por Técnica', 14, 132);

        const tableData = [];
        EXERCISES.forEach(tech => {
            const required = BELT_REQUIREMENTS[currentStudent.cinturon][tech.id];
            const leftCompleted = currentStudent.ejercicios[tech.id]?.izquierda || 0;
            const rightCompleted = currentStudent.ejercicios[tech.id]?.derecha || 0;
            const totalCompleted = leftCompleted + rightCompleted;
            const totalRequired = required * 2; // Both legs
            const percentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

            tableData.push([
                tech.name,
                leftCompleted.toLocaleString('es-ES'),
                rightCompleted.toLocaleString('es-ES'),
                totalCompleted.toLocaleString('es-ES'),
                totalRequired.toLocaleString('es-ES'),
                `${ percentage }% `
            ]);
        });

        doc.autoTable({
            startY: 137,
            head: [['Técnica', 'Izq.', 'Der.', 'Total', 'Requerido', 'Progreso']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [244, 165, 0],
                textColor: [26, 26, 46],
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                textColor: [60, 60, 60],
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 50 },
                1: { cellWidth: 20 },
                2: { cellWidth: 20 },
                3: { cellWidth: 25 },
                4: { cellWidth: 30 },
                5: { cellWidth: 25, fontStyle: 'bold', textColor: [244, 165, 0] }
            },
            margin: { left: 14, right: 14 }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.height;

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Página ${ i } de ${ pageCount } - Ki Full Katai © ${ new Date().getFullYear() } `,
                105,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        const fileName = `KiFull_${ currentStudent.nombre }_${ currentStudent.apellidos }_${ new Date().toISOString().split('T')[0] }.pdf`;
        doc.save(fileName);

        hideLoading();

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error al generar el PDF. Por favor, intenta de nuevo.');
        hideLoading();
    }
});

// ===================================
// Session Management Functions  
// ===================================

// Login existing student by email
async function loginStudent(email) {
    try {
        showLoading();

        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', email.toLowerCase().trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            hideLoading();
            showToast('Email no encontrado. ¿Quieres registrarte?');
            return null;
        }

        const studentDoc = querySnapshot.docs[0];
        const studentData = {
            firestoreId: studentDoc.id,
            ...studentDoc.data()
        };

        hideLoading();
        return studentData;
    } catch (error) {
        console.error('Error en login:', error);
        hideLoading();
        showToast('Error al iniciar sesión');
        return null;
    }
}

// Register new student with unique email
async function registerStudentWithEmail(nombre, apellidos, email, cinturon) {
    try {
        showLoading();

        // Check if email already exists
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', email.toLowerCase().trim()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            hideLoading();
            showToast('Este email ya está registrado');
            return null;
        }

        // Create new student
        const requirements = BELT_REQUIREMENTS[cinturon];
        const ejercicios = {};

        Object.keys(requirements).forEach(exerciseId => {
            ejercicios[exerciseId] = {
                izquierda: 0,
                derecha: 0
            };
        });

        const newStudent = {
            nombre,
            apellidos,
            email: email.toLowerCase().trim(),
            cinturon,
            fechaRegistro: new Date().toISOString(),
            totalRepeticiones: ejercicios
        };

        const docRef = await addDoc(collection(db, 'students'), newStudent);

        hideLoading();
        showToast('¡Registro exitoso!');

        return {
            firestoreId: docRef.id,
            ...newStudent
        };
    } catch (error) {
        console.error('Error en registro:', error);
        hideLoading();
        showToast('Error al registrar');
        return null;
    }
}

// Create new training session
async function createTrainingSession(studentId, repeticiones, notas = '') {
    try {
        showLoading();

        const sessionData = {
            fecha: new Date().toISOString(),
            repeticiones,
            notas: notas.trim()
        };

        // Add session to subcollection
        const sessionsRef = collection(db, 'students', studentId, 'sessions');
        await addDoc(sessionsRef, sessionData);

        // Update student's total repetitions
        const studentRef = doc(db, 'students', studentId);
        const newTotals = { ...currentStudent.totalRepeticiones };

        Object.keys(repeticiones).forEach(exerciseId => {
            if (!newTotals[exerciseId]) {
                newTotals[exerciseId] = { izquierda: 0, derecha: 0 };
            }
            newTotals[exerciseId].izquierda += repeticiones[exerciseId].izquierda || 0;
            newTotals[exerciseId].derecha += repeticiones[exerciseId].derecha || 0;
        });

        await updateDoc(studentRef, {
            totalRepeticiones: newTotals
        });

        // Update current student
        currentStudent.totalRepeticiones = newTotals;

        hideLoading();
        showToast('Sesión guardada exitosamente! 🎉');

        return true;
    } catch (error) {
        console.error('Error al crear sesión:', error);
        hideLoading();
        showToast('Error al guardar la sesión');
        return false;
    }
}

// Get all training sessions for a student
async function getStudentSessions(studentId) {
    try {
        const sessionsRef = collection(db, 'students', studentId, 'sessions');
        const q = query(sessionsRef, orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);

        const sessions = [];
        querySnapshot.forEach((doc) => {
            sessions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return sessions;
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        return [];
    }
}

// Render sessions history
function renderSessionsHistory(sessions) {
    const container = document.getElementById('sessionsList');

    if (!sessions || sessions.length === 0) {
        container.innerHTML = `
            < div class="empty-state" >
                <p>📅 Aún no has registrado ninguna sesión</p>
                <p>Crea tu primera sesión en la pestaña "Nueva Sesión"</p>
            </div >
            `;
        return;
    }

    container.innerHTML = sessions.map(session => {
        const date = new Date(session.fecha);
        const formattedDate = date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let totalSession = 0;
        const techniquesList = Object.entries(session.repeticiones).map(([id, reps]) => {
            const exercise = EXERCISES.find(ex => ex.id === id);
            const total = (reps.izquierda || 0) + (reps.derecha || 0);
            totalSession += total;
            return `
            < div class="session-technique" >
                <strong>${exercise?.name || id}:</strong> 
                    ${ reps.izquierda } + ${ reps.derecha } = ${ total }
                </div >
            `;
        }).join('');

        const notesHtml = session.notas ? `
            < div class="session-notes" >
                💭 ${ session.notas }
            </div >
            ` : '';

        return `
            < div class="session-card" >
                <div class="session-header">
                    <div class="session-date">📅 ${formattedDate}</div>
                    <div class="session-total">Total: ${totalSession.toLocaleString('es-ES')} reps</div>
                </div>
                <div class="session-techniques">
                    ${techniquesList}
                </div>
                ${ notesHtml }
            </div >
            `;
    }).join('');
}

