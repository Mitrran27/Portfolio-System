import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi'

export const usePortfolioStore = defineStore('portfolio', () => {
  const info = ref(null)
  const projects = ref([])
  const skills = ref([])
  const socials = ref([])
  const loading = ref(false)

  const fetchAll = async () => {
    loading.value = true
    try {
      const [infoRes, projectsRes, skillsRes, socialsRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/portfolio/projects'),
        api.get('/portfolio/skills'),
        api.get('/portfolio/socials'),
      ])
      info.value = infoRes.data
      projects.value = projectsRes.data
      skills.value = skillsRes.data
      socials.value = socialsRes.data
    } finally {
      loading.value = false
    }
  }

  const updateInfo = async (payload) => {
    const { data } = await api.put('/portfolio', payload)
    info.value = data
  }

  const createProject = async (payload) => {
    const { data } = await api.post('/portfolio/projects', payload)
    projects.value.push(data)
    return data
  }

  const updateProject = async (id, payload) => {
    const { data } = await api.put(`/portfolio/projects/${id}`, payload)
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx] = data
  }

  const deleteProject = async (id) => {
    await api.delete(`/portfolio/projects/${id}`)
    projects.value = projects.value.filter(p => p.id !== id)
  }

  const createSkill = async (payload) => {
    const { data } = await api.post('/portfolio/skills', payload)
    skills.value.push(data)
  }

  const updateSkill = async (id, payload) => {
    const { data } = await api.put(`/portfolio/skills/${id}`, payload)
    const idx = skills.value.findIndex(s => s.id === id)
    if (idx !== -1) skills.value[idx] = data
  }

  const deleteSkill = async (id) => {
    await api.delete(`/portfolio/skills/${id}`)
    skills.value = skills.value.filter(s => s.id !== id)
  }

  const updateSocials = async (payload) => {
    const { data } = await api.put('/portfolio/socials', payload)
    socials.value = data
  }

  return {
    info, projects, skills, socials, loading,
    fetchAll, updateInfo,
    createProject, updateProject, deleteProject,
    createSkill, updateSkill, deleteSkill,
    updateSocials
  }
})
