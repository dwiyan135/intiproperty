const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout-admin', { method: 'POST' })
      const data = await res.json()
      alert(data.message)
      window.location.href = '/login-admin'
    } catch (err) {
      alert('Logout gagal')
    }
  }
  