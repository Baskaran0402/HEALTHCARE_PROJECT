export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  INSTITUTION: 'institution',
  SUPER_ADMIN: 'super_admin'
}

export const NAV_CONFIG = {

  patient: {
    label: 'Patient Portal',
    color: '#0fd68c',
    sections: [
      {
        title: 'My Health',
        items: [
          { label: 'Health Assessment',  path: '/assessment',      icon: 'activity',    desc: 'Full multi-disease screening' },
          { label: 'Brain MRI Analysis', path: '/brain-tumor',     icon: 'brain',       desc: 'Upload MRI for AI detection' },
          { label: 'My Reports',         path: '/my-reports',      icon: 'file-text',   desc: 'View and download past results' },
        ]
      },
      {
        title: 'Doctors',
        items: [
          { label: 'Find a Doctor',      path: '/find-doctor',     icon: 'search',      desc: 'Match by condition + location' },
          { label: 'My Appointments',    path: '/appointments',    icon: 'calendar',    desc: 'Upcoming consultations' },
        ]
      },
      {
        title: 'Account',
        items: [
          { label: 'My Profile',         path: '/profile',         icon: 'user',        desc: 'Personal data + privacy' },
        ]
      }
    ]
  },

  doctor: {
    label: 'Clinical Workspace',
    color: '#3b82f6',
    sections: [
      {
        title: 'Clinical',
        items: [
          { label: 'Patient Queue',      path: '/queue',           icon: 'users',       desc: 'Today\'s appointments' },
          { label: 'Patient Records',    path: '/records',         icon: 'folder',      desc: 'Full history + risk timeline' },
          { label: 'Run Assessment',     path: '/assessment',      icon: 'activity',    desc: 'Screen patient on their behalf' },
          { label: 'Brain MRI',          path: '/brain-tumor',     icon: 'brain',       desc: 'MRI analysis tool' },
        ]
      },
      {
        title: 'Consultations',
        items: [
          { label: 'Video Call',         path: '/consult',         icon: 'video',       desc: 'Start patient video session' },
          { label: 'My Schedule',        path: '/schedule',        icon: 'calendar',    desc: 'Manage availability' },
          { label: 'Risk Dashboard',     path: '/risk-dashboard',  icon: 'bar-chart',   desc: 'All patients risk overview' },
        ]
      },
      {
        title: 'Account',
        items: [
          { label: 'My Profile',         path: '/profile',         icon: 'user',        desc: 'Credentials + settings' },
        ]
      }
    ]
  },

  institution: {
    label: 'Institution Control',
    color: '#f59e0b',
    sections: [
      {
        title: 'Overview',
        items: [
          { label: 'Dashboard',          path: '/inst-dashboard',  icon: 'layout',      desc: 'Population risk overview' },
          { label: 'Risk Analytics',     path: '/analytics',       icon: 'trending-up', desc: 'DiseaseTrend charts' },
        ]
      },
      {
        title: 'Management',
        items: [
          { label: 'Doctor Registry',    path: '/doctors',         icon: 'users',       desc: 'Add/remove/verify doctors' },
          { label: 'Patient Registry',   path: '/patients',        icon: 'user-check',  desc: 'All patients across facility' },
          { label: 'Appointments',       path: '/all-appointments',icon: 'calendar',    desc: 'Full schedule overview' },
        ]
      },
      {
        title: 'Governance',
        items: [
          { label: 'Access Control',     path: '/access',          icon: 'shield',      desc: 'Role assignment + audit logs' },
          { label: 'Compliance',         path: '/compliance',      icon: 'file-check',  desc: 'DPDP/HIPAA audit exports' },
          { label: 'System Health',      path: '/system',          icon: 'cpu',         desc: 'API + model status' },
        ]
      }
    ]
  },
  
  super_admin: {
    label: 'Master Intelligence Control',
    color: '#ff0055',
    sections: [
      {
        title: 'Patient Portal',
        items: [
          { label: 'Assessment',  path: '/assessment',      icon: 'activity',    desc: 'Screening' },
          { label: 'Brain MRI',   path: '/brain-tumor',     icon: 'brain',       desc: 'MRI' },
          { label: 'Reports',     path: '/my-reports',      icon: 'file-text',   desc: 'Results' },
        ]
      },
      {
        title: 'Clinical Workspace',
        items: [
          { label: 'Queue',       path: '/queue',           icon: 'users',       desc: 'Appointments' },
          { label: 'Records',     path: '/records',         icon: 'folder',      desc: 'History' },
          { label: 'Risk View',   path: '/risk-dashboard',  icon: 'bar-chart',   desc: 'Analytics' },
        ]
      },
      {
        title: 'System Governance',
        items: [
          { label: 'Institution', path: '/inst-dashboard',  icon: 'layout',      desc: 'Overview' },
          { label: 'Registry',    path: '/doctors',         icon: 'users',       desc: 'Doctors' },
          { label: 'Access',      path: '/access',          icon: 'shield',      desc: 'Security' },
        ]
      }
    ]
  }

}

// Flat allowed paths per role (for ProtectedRoute):
export const ALLOWED_PATHS = {
  patient:     ['/assessment','/brain-tumor','/my-reports','/find-doctor','/appointments','/profile'],
  doctor:      ['/queue','/records','/assessment','/brain-tumor','/consult','/schedule','/risk-dashboard','/profile'],
  institution: ['/inst-dashboard','/analytics','/doctors','/patients','/all-appointments','/access','/compliance','/system'],
  super_admin: ['/assessment','/brain-tumor','/my-reports','/find-doctor','/appointments','/profile','/queue','/records','/consult','/schedule','/risk-dashboard','/inst-dashboard','/analytics','/doctors','/patients','/all-appointments','/access','/compliance','/system']
}
