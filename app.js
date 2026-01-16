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
    orderBy
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

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const cinturon = document.getElementById('cinturon').value;

    currentStudent = await createStudent(nombre, apellidos, cinturon);

    renderStudentView();
    showView('studentView');
    showToast('¡Registro exitoso! Comienza tu entrenamiento.');
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
            const ejercicioData = currentStudent.ejercicios[exercise.id];

            if (izquierda > 0) {
                ejercicioData.izquierda.total += izquierda;
                ejercicioData.izquierda.registros.push({ fecha, cantidad: izquierda });
                totalAdded += izquierda;
            }

            if (derecha > 0) {
                ejercicioData.derecha.total += derecha;
                ejercicioData.derecha.registros.push({ fecha, cantidad: derecha });
                totalAdded += derecha;
            }

            // Clear inputs
            izquierdaInput.value = '';
            derechaInput.value = '';
        }
    });

    if (totalAdded > 0) {
        showLoading('Guardando progreso...');
        await saveStudent(currentStudent);
        hideLoading();
        renderProgress();
        showToast(`¡Excelente! ${totalAdded} repeticiones registradas.`);
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
        const ejercicioData = currentStudent.ejercicios[exercise.id];
        const requirement = requirements[exercise.id];

        totalCompleted += ejercicioData.izquierda.total + ejercicioData.derecha.total;
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
        const ejercicioData = currentStudent.ejercicios[exercise.id];
        const requirement = requirements[exercise.id];

        const izquierdaPercentage = Math.min(100, Math.round((ejercicioData.izquierda.total / requirement) * 100));
        const derechaPercentage = Math.min(100, Math.round((ejercicioData.derecha.total / requirement) * 100));

        const averagePercentage = Math.round((izquierdaPercentage + derechaPercentage) / 2);

        return `
            <div class="exercise-progress">
                <div class="exercise-progress-header">
                    <span class="exercise-progress-name">${exercise.fullName}</span>
                    <span class="exercise-progress-percentage">${averagePercentage}%</span>
                </div>
                
                <div class="leg-progress">
                    <div class="leg-label">
                        <span>Pierna Izquierda</span>
                        <span>${ejercicioData.izquierda.total.toLocaleString()} / ${requirement.toLocaleString()}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${izquierdaPercentage}%"></div>
                    </div>
                </div>
                
                <div class="leg-progress">
                    <div class="leg-label">
                        <span>Pierna Derecha</span>
                        <span>${ejercicioData.derecha.total.toLocaleString()} / ${requirement.toLocaleString()}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${derechaPercentage}%"></div>
                    </div>
                </div>
            </div>
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
        <table class="students-table">
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
        </table>
    `;

    container.innerHTML = tableHTML;
}

// Filter change event
document.getElementById('filterBelt').addEventListener('change', () => {
    renderAllStudentsProgress();
});

// ===================================
// Tab Navigation
// ===================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        showTab(tabName);
    });
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
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 33, { align: 'center' });

        // Student Information
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Información del Estudiante', 14, 50);

        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.text(`Nombre: ${currentStudent.nombre} ${currentStudent.apellidos}`, 14, 58);

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

        doc.text(`Cinturón Objetivo: ${beltEmojis[currentStudent.cinturon]} ${beltNames[currentStudent.cinturon]}`, 14, 66);
        doc.text(`Fecha de Registro: ${new Date(currentStudent.fechaRegistro).toLocaleDateString('es-ES')}`, 14, 74);

        // Progress Summary
        const progress = calculateOverallProgress(currentStudent);
        doc.setFont(undefined, 'bold');
        doc.text('Resumen de Progreso', 14, 87);

        doc.setFont(undefined, 'normal');
        doc.text(`Progreso General: ${progress.percentage}%`, 14, 95);
        doc.text(`Total Completado: ${progress.completed.toLocaleString('es-ES')} repeticiones`, 14, 103);
        doc.text(`Total Requerido: ${progress.required.toLocaleString('es-ES')} repeticiones`, 14, 111);
        doc.text(`Pendiente: ${progress.pending.toLocaleString('es-ES')} repeticiones`, 14, 119);

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
                `${percentage}%`
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
                `Página ${i} de ${pageCount} - Ki Full Katai © ${new Date().getFullYear()}`,
                105,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        const fileName = `KiFull_${currentStudent.nombre}_${currentStudent.apellidos}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

        hideLoading();

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error al generar el PDF. Por favor, intenta de nuevo.');
        hideLoading();
    }
});
