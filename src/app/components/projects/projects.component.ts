import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  projects = [
    {
      title: "GPMS: Garment Production Management",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["Next.js","React","NestJS","Prisma","PostgreSQL"],
      myRole: "Full-stack project",
      description: "Factory operations platform covering production planning, buyer and material management, purchase orders, inventory, cutting, sewing, and QC workflows. The API supports multi-factory access and validation.",
      gitUrl: "https://github.com/rahat664/gpms-web",
      demoUrl: "https://gpms-web664.vercel.app"
    },
    {
      title: "Spotter: Flight Search",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["React","TypeScript","Amadeus API","Zustand","Recharts"],
      myRole: "Frontend and API integration",
      description: "Flight search interface with rich filtering, normalized flight results, and synchronized price visualizations. Server-side API functions keep provider credentials out of the browser.",
      gitUrl: "https://github.com/rahat664/spotter-flight-search",
      demoUrl: ""
    },
    {
      title: "CineScope: Movie Watchlist",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["React","TypeScript","Vite","Tailwind CSS"],
      myRole: "Frontend product project",
      description: "Responsive movie discovery experience featuring debounced search, watchlist management, loading states, keyboard shortcuts, and client-side demo authentication.",
      gitUrl: "https://github.com/rahat664/movie-watchlist",
      demoUrl: "https://movie-watchlist-app-six.vercel.app"
    },
    {
      title: "WingsFin: Market Dashboard",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["React","NestJS","Socket.IO","PostgreSQL"],
      myRole: "Full-stack technical assignment",
      description: "Live and historical market-data dashboard with WebSocket updates, consistent time-series rendering, and containerized local development using demo market data.",
      gitUrl: "https://github.com/rahat664/wingsfin-assignment",
      demoUrl: ""
    },
    {
      title: "Job Board REST API",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["NestJS","MongoDB","Mongoose","Jest"],
      myRole: "Backend project",
      description: "Modular REST API for jobs and applications with DTO validation, pagination, administrative access control, and automated tests.",
      gitUrl: "https://github.com/rahat664/jobboard-backend",
      demoUrl: ""
    },
    {
      title: "Supply Chain & Logistics Systems",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["Angular","TypeScript","REST APIs","Maps"],
      myRole: "Professional experience",
      description: "Professional experience building logistics interfaces, operational workflows, and real-time tracking capabilities. Proprietary implementation details and source code are not shared.",
      gitUrl: "",
      demoUrl: ""
    },
    {
      title: "Polling Booth-Based E-Voting Research",
      badgeColors: ['#16f2b3', '#60a5fa', '#facc15'],
      tools: ["RSA","Blind Signatures","Research"],
      myRole: "Research contribution",
      description: "Published work exploring a polling-booth-based e-voting design using blind signatures. See the publication for the verified technical scope.",
      gitUrl: "https://ieeexplore.ieee.org/document/10625521",
      demoUrl: ""
    }
  ];
}
