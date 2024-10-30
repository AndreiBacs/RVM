export function getSeverity (status: string): string {
    switch (status) {
      case 'operational':
        return 'success'
      case 'maintenance':
        return 'warning'
      case 'offline':
        return 'danger'
      default:
        return 'info'
    }
  }