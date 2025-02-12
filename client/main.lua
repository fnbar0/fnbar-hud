HUD = {}

HUD.colors = { 
    mainColor = Config.DefaultColors.MainColor,
    secondaryColor = Config.DefaultColors.SecondaryColor,
    backgroundColor = Config.DefaultColors.BackgroundColor
}

function HUD:Toggle(state)
    SendNUIMessage({ type = "toggle", value = state })
end

function HUD:Start()
    while not ESX.IsPlayerLoaded() do
        Wait(200)
    end
    if Config.Status then 
        self:StatusThread()
    end
    self:VoiceThread()
    self:VehicleCache()
    self:Toggle(true)

    RegisterCommand('hudsettings', function()
        SetNuiFocus(true, true)
        SendNUIMessage({ type = "open_settings" })
    end, false)

    RegisterNUICallback("focusoff", function(data, cb)
        SetNuiFocus(false, false)
    end)

    RegisterNUICallback("cacheColors", function(data, cb)
        self.colors.mainColor = data.mainColor
        self.colors.secondaryColor = data.secondaryColor
        self.colors.backgroundColor = data.backgroundColor
        SetResourceKvp('fnbar-hud:' .. 'maincolor', self.colors.mainColor)
        SetResourceKvp('fnbar-hud:' .. 'secondarycolor', self.colors.secondaryColor)
        SetResourceKvp('fnbar-hud:' .. 'backgroundcolor', self.colors.backgroundColor)
        TriggerEvent('fnbar-updatecolors', self.colors)
    end)
    
    local cache = StartFindKvp('fnbar-hud:')

    if kvpHandle ~= -1 then 
        local key
        
        repeat
            key = FindKvp(kvpHandle)
    
            if key then
                if key == 'fnbar-hud:maincolor' then
                    self.colors.mainColor = GetResourceKvpString(key)
                elseif key == 'fnbar-hud:secondarycolor' then
                    self.colors.secondaryColor = GetResourceKvpString(key)
                elseif key == 'fnbar-hud:backgroundcolor' then
                    self.colors.backgroundColor = GetResourceKvpString(key)
                end
            end
        until not key
    
        EndFindKvp(kvpHandle)

    end
    SendNUIMessage({ type = "update_colors", value = self.colors })
    SendNUIMessage({ type = "update_default_colors", value = Config.DefaultColors })
    TriggerEvent('fnbar-updatecolors', self.colors)
end

AddEventHandler("onResourceStart", function(resource)
    if GetCurrentResourceName() ~= resource then
        return
    end
    Wait(1000)
    HUD:Start()
end)

AddEventHandler("onClientResourceStart", function(resource) -- integration with scoreboard and notify
    if resource == "fnbar-scoreboard" or resource == "fnbar-notify" then
        Wait(100)
        TriggerEvent('fnbar-updatecolors', HUD.colors)
    end
end)

AddEventHandler("esx:playerLoaded", function()
    while IsScreenFadedOut() do
        Wait(200)
    end
    Wait(100)
    HUD:Start()
end)

AddEventHandler("esx:pauseMenuActive", function(state)
    HUD:Toggle(not state)
end)

exports("toggleHud", function(state) 
    return HUD:Toggle(state)
end)
