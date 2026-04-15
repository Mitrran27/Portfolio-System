import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/composables/useApi'

export const usePortfolioStore = defineStore('portfolio', () => {
  const info = ref(null)
  const projects = ref([])
  const skills = ref([])
  const socials = ref([])
  const experiences = ref([])
  const education = ref([])
  const loading = ref(false)

  const fetchAll = async () => {
    loading.value = true
    try {
      const [infoRes, projectsRes, skillsRes, socialsRes, expRes, eduRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/portfolio/projects'),
        api.get('/portfolio/skills'),
        api.get('/portfolio/socials'),
        api.get('/portfolio/experiences'),
        api.get('/portfolio/education'),
      ])
      info.value = infoRes.data
      projects.value = projectsRes.data
      skills.value = skillsRes.data
      socials.value = socialsRes.data
      experiences.value = expRes.data
      education.value = eduRes.data
    } finally {
      loading.value = false
    }
  }

  const updateInfo = async (payload) => {
    const { data } = await api.put('/portfolio', payload)
    info.value = data
  }

  // Projects
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

  // Skills
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

  // Socials
  const updateSocials = async (payload) => {
    const { data } = await api.put('/portfolio/socials', payload)
    socials.value = data
  }

  // Experiences
  const createExperience = async (payload) => {
    const { data } = await api.post('/portfolio/experiences', payload)
    experiences.value.push(data)
    return data
  }
  const updateExperience = async (id, payload) => {
    const { data } = await api.put(`/portfolio/experiences/${id}`, payload)
    const idx = experiences.value.findIndex(e => e.id === id)
    if (idx !== -1) experiences.value[idx] = data
  }
  const deleteExperience = async (id) => {
    await api.delete(`/portfolio/experiences/${id}`)
    experiences.value = experiences.value.filter(e => e.id !== id)
  }

  // Education
  const createEducation = async (payload) => {
    const { data } = await api.post('/portfolio/education', payload)
    education.value.push(data)
    return data
  }
  const updateEducation = async (id, payload) => {
    const { data } = await api.put(`/portfolio/education/${id}`, payload)
    const idx = education.value.findIndex(e => e.id === id)
    if (idx !== -1) education.value[idx] = data
  }
  const deleteEducation = async (id) => {
    await api.delete(`/portfolio/education/${id}`)
    education.value = education.value.filter(e => e.id !== id)
  }

  return {
    info, projects, skills, socials, experiences, education, loading,
    fetchAll, updateInfo,
    createProject, updateProject, deleteProject,
    createSkill, updateSkill, deleteSkill,
    updateSocials,
    createExperience, updateExperience, deleteExperience,
    createEducation, updateEducation, deleteEducation
  }
})
