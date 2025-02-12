fx_version "cerulean"

author 'fnbar'
description "cool hud"
game "gta5"
version '1.0.0'
lua54 'yes'

shared_scripts {
	'@es_extended/imports.lua',
	'@ox_lib/init.lua'
}

client_scripts {
	'config.lua',
	'client/main.lua',
	'client/status.lua',
	'client/voice.lua',
	'client/vehicle.lua',
}

ui_page 'nui/index.html'

files {
    'nui/index.html',
	'nui/script.js',
	'nui/style.css'
}

dependencies {
	'es_extended',
    'ox_lib'
}
