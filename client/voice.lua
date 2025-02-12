function HUD:VoiceThread()
    Citizen.CreateThread(function()
        self.lastTalking = false
        while ESX.IsPlayerLoaded() do
            self.talking = NetworkIsPlayerTalking(cache.playerId)
            if self.talking ~= self.lastTalking then
                self.lastTalking = self.talking
                SendNUIMessage({ type = "voice_talking", value = self.talking })
            end
            Wait(200)
        end
    end)
end

if GetResourceState("pma-voice") == "started" then
    while not ESX.IsPlayerLoaded() do
        Wait(200)
    end
    Wait(100)
    SendNUIMessage({ type = "voice_range", value = LocalPlayer.state.proximity.index })
end

AddEventHandler("pma-voice:setTalkingMode", function(newTalkingRange)
    SendNUIMessage({ type = "voice_range", value = newTalkingRange})
end)
