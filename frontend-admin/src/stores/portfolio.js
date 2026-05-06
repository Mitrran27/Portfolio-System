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
      // Single request — same /all endpoint used by portfolio frontend
      const { data } = await api.get('/portfolio/all')
      info.value        = data.info
      skills.value      = data.skills      || []
      socials.value     = data.socials     || []
      experiences.value = data.experiences || []
      education.value   = data.education   || []
      projects.value    = (data.projects || [])
        .slice()
        .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
    } finally {
      loading.value = false
    }
  }

  const updateInfo = async (payload) => {
    // Optimistic update — UI reflects change immediately
    const prev = info.value
    info.value = { ...info.value, ...payload }
    try {
      const { data } = await api.put('/portfolio', payload)
      info.value = data
    } catch (e) {
      info.value = prev
      throw e
    }
  }

  // Projects
  const sortProjects = () => {
    projects.value = projects.value
      .slice()
      .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
  }

  // Re-fetch only projects (used after sort-order mutations where server re-orders rows)
  const refreshProjects = async () => {
    const { data } = await api.get('/portfolio/projects')
    projects.value = (data || []).slice().sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
  }
  const createProject = async (payload) => {
    const { data } = await api.post('/portfolio/projects', payload)
    // Only re-fetch if sort_order was specified (server may have shifted others)
    if (payload.sort_order) {
      await refreshProjects()
    } else {
      projects.value = [...projects.value, data].sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
    }
    return data
  }
  const updateProject = async (id, payload) => {
    // Optimistic update — show change immediately in UI
    const idx = projects.value.findIndex(p => p.id === id)
    const prev = idx !== -1 ? { ...projects.value[idx] } : null
    if (idx !== -1) {
      projects.value[idx] = { ...projects.value[idx], ...payload }
      sortProjects()
    }
    try {
      await api.put(`/portfolio/projects/${id}`, payload)
      // If sort_order changed, re-fetch to get server-corrected positions
      if (payload.sort_order && prev?.sort_order !== payload.sort_order) {
        await refreshProjects()
      }
    } catch (e) {
      // Roll back optimistic update on error
      if (idx !== -1 && prev) { projects.value[idx] = prev; sortProjects() }
      throw e
    }
  }

  const deleteProject = async (id) => {
    // Optimistic removal
    const prev = [...projects.value]
    projects.value = projects.value.filter(p => p.id !== id)
    try {
      await api.delete(`/portfolio/projects/${id}`)
    } catch (e) {
      projects.value = prev
      throw e
    }
  }

  // Skills
  const createSkill = async (payload) => {
    const { data } = await api.post('/portfolio/skills', payload)
    skills.value.push(data)
  }

  const updateSkill = async (id, payload) => {
    const idx = skills.value.findIndex(s => s.id === id)
    const prev = idx !== -1 ? { ...skills.value[idx] } : null
    if (idx !== -1) skills.value[idx] = { ...skills.value[idx], ...payload }
    try {
      const { data } = await api.put(`/portfolio/skills/${id}`, payload)
      if (idx !== -1) skills.value[idx] = data
    } catch (e) {
      if (idx !== -1 && prev) skills.value[idx] = prev
      throw e
    }
  }

  const deleteSkill = async (id) => {
    const prev = [...skills.value]
    skills.value = skills.value.filter(s => s.id !== id)
    try {
      await api.delete(`/portfolio/skills/${id}`)
    } catch (e) {
      skills.value = prev
      throw e
    }
  }

  // Socials
  const updateSocials = async (payload) => {
    const prev = [...socials.value]
    socials.value = payload
    try {
      const { data } = await api.put('/portfolio/socials', payload)
      socials.value = data
    } catch (e) {
      socials.value = prev
      throw e
    }
  }

  // Experiences
  const createExperience = async (payload) => {
    const { data } = await api.post('/portfolio/experiences', payload)
    experiences.value.push(data)
    return data
  }

  const updateExperience = async (id, payload) => {
    const idx = experiences.value.findIndex(e => e.id === id)
    const prev = idx !== -1 ? { ...experiences.value[idx] } : null
    if (idx !== -1) experiences.value[idx] = { ...experiences.value[idx], ...payload }
    try {
      const { data } = await api.put(`/portfolio/experiences/${id}`, payload)
      if (idx !== -1) experiences.value[idx] = data
    } catch (e) {
      if (idx !== -1 && prev) experiences.value[idx] = prev
      throw e
    }
  }

  const deleteExperience = async (id) => {
    const prev = [...experiences.value]
    experiences.value = experiences.value.filter(e => e.id !== id)
    try {
      await api.delete(`/portfolio/experiences/${id}`)
    } catch (e) {
      experiences.value = prev
      throw e
    }
  }

  // Education
  const createEducation = async (payload) => {
    const { data } = await api.post('/portfolio/education', payload)
    education.value.push(data)
    return data
  }

  const updateEducation = async (id, payload) => {
    const idx = education.value.findIndex(e => e.id === id)
    const prev = idx !== -1 ? { ...education.value[idx] } : null
    if (idx !== -1) education.value[idx] = { ...education.value[idx], ...payload }
    try {
      const { data } = await api.put(`/portfolio/education/${id}`, payload)
      if (idx !== -1) education.value[idx] = data
    } catch (e) {
      if (idx !== -1 && prev) education.value[idx] = prev
      throw e
    }
  }

  const deleteEducation = async (id) => {
    const prev = [...education.value]
    education.value = education.value.filter(e => e.id !== id)
    try {
      await api.delete(`/portfolio/education/${id}`)
    } catch (e) {
      education.value = prev
      throw e
    }
  }

  return {
    info, projects, skills, socials, experiences, education, loading,
    fetchAll, updateInfo,
    createProject, updateProject, deleteProject, refreshProjects,
    createSkill, updateSkill, deleteSkill,
    updateSocials,
    createExperience, updateExperience, deleteExperience,
    createEducation, updateEducation, deleteEducation
  }
})