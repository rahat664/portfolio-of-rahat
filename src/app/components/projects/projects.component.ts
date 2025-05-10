import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
   projects = [
    {
      topPosition: 0,
      title: 'SILENCE V2 (ERP System)',
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ['Angular', 'SCSS', 'Tailwind CSS', 'Angular Material'],
      myRole: 'Frontend Developer',
      description: 'Redesigned and enhanced the SILENCE ERP system with improved UI/UX, integrating features like role-based access control (RBAC), dynamic tables with search & pagination, and module-level permission management. Implemented light/dark mode, and developed several modules including apartment service desk and receipt tracking.'
    },
    {
      topPosition: 68,
      title: 'RMS_POS (Restaurant Management System)',
      badgeColors: ['#fb923c', '#4ade80', '#a78bfa'],
      tools: ['Angular', 'SCSS', 'Tailwind CSS', 'Angular Material'],
      myRole: 'Frontend Developer',
      description: 'Built a Point of Sale system for restaurants with modules for real-time order management, inventory tracking, and sales analytics. Ensured responsive design and seamless user interaction using modern Angular component architecture and design systems.'
    },
    {
      topPosition: 136,
      title: 'MAAP Platform (Athod Tech)',
      badgeColors: ['#f87171', '#38bdf8', '#bbf7d0'],
      tools: ['Angular', 'TypeScript', 'Firebase', 'JWT'],
      myRole: 'Frontend Engineer',
      description: 'Worked on MAAP, a scalable Angular platform with JWT authentication and secure session management. Enhanced UX using Velzon Angular template and implemented reactive forms for structured household data collection. Focused on modularity and performance through reusable components.'
    },
    {
      topPosition: 204,
      title: 'Supply Chain Management System',
      badgeColors: ['#34d399', '#6366f1', '#fcd34d'],
      tools: ['Angular', 'Tailwind Css', 'Typescript', 'Google Maps API', 'Angular material'],
      myRole: 'Full Stack Developer',
      description: 'Led development of a logistics management system at Shamolima Ltd., enabling real-time vehicle tracking, optimized trip routes, and shipment monitoring. Built scalable APIs, integrated map-based services, and reduced delivery time by 15% with improved routing algorithms.'
    },
    {
      topPosition: 272,
      title: 'ELMA (Education Management System)',
      badgeColors: ['#fbbf24', '#60a5fa', '#a3e635'],
      tools: ['Angular', 'SCSS', 'Angular Material', 'Tailwind CSS'],
      myRole: 'Frontend Developer',
      description: 'Designed and developed UI components for ELMA, supporting student management, class schedules, and academic tracking. Focused on UI performance and accessibility while maintaining design consistency across modules.'
    },
    {
      topPosition: 340,
      title: 'JOMIDAR (Real Estate ERP)',
      badgeColors: ['#c084fc', '#f87171', '#4ade80'],
      tools: ['Angular', 'SCSS', 'Tailwind CSS'],
      myRole: 'Frontend Developer',
      description: 'Developed modules for managing real estate listings, property transactions, and client interactions. Contributed to a seamless frontend experience and ensured mobile responsiveness using SCSS and Tailwind CSS.'
    },
    {
      topPosition: 408,
      title: 'Polling Booth-Based E-Voting System',
      badgeColors: ['#16f2b3', '#0ea5e9', '#f97316'],
      tools: ['Blockchain', 'RSA Encryption', 'Blind Signatures', 'IEEE'],
      myRole: 'Lead Developer & Researcher',
      description: 'Published in IEEE, this blockchain-based e-voting platform used RSA encryption and blind signatures to ensure security, privacy, and verifiability in digital voting systems. Focused on cryptographic protocols and smart contract logic.'
    }
  ];
}
