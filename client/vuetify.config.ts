import { md3 } from 'vuetify/blueprints'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
import { COLORS } from './app/utils/consts/colors'
import type { ThemeDefinition } from 'vuetify'

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: COLORS,
  variables: {
    'border-color': '#FFF',
    'border-opacity': 0.12,
  },
}

const VBtnGroup = {
  rounded: 'lg',
}

const VBtn = {
  variant: 'tonal',
  rounded: 'lg',
}
const VTextField = {
  variant: 'underlined',
}
const VSelect = {
  variant: 'underlined',
}
const VAutocomplete = {
  variant: 'underlined',
}
const VCombobox = {
  variant: 'underlined',
}
const VCard = {
  variant: 'flat',
  VCardActions: {
    VBtn,
  },
  VTextField,
  VAutocomplete,
  VBtnGroup,
  VCombobox,
  VSelect,
}

export default defineVuetifyConfiguration({
  blueprint: md3,
  localeMessages: ['en'],
  icons: {
    defaultSet: 'fa',
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: darkTheme,
    },
  },
  defaults: {
    VCard,
    VBtn,
    VTextField,
    VAutocomplete,
  },
})
