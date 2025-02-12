if Config.Status then
    local values = {}

    AddEventHandler("esx_status:onTick", function(data)
        local hunger, thirst
        for i = 1, #data do
            if data[i].name == "thirst" then
                thirst = math.floor(data[i].percent)
            end
            if data[i].name == "hunger" then
                hunger = math.floor(data[i].percent)
            end
        end
        values.health = math.floor(GetEntityHealth(cache.ped) / GetEntityMaxHealth(cache.ped) * 100)
        values.health = math.floor(((GetEntityHealth(cache.ped) - 100) / (GetEntityMaxHealth(cache.ped) - 100)) * 100)
        values.armor = GetPedArmour(cache.ped)
        values.drink = thirst
        values.food = hunger
    end)

    function HUD:StatusThread()
        values = {}
        CreateThread(function()
            while ESX.PlayerLoaded do
                local oxygen, stamina = 0, 0
                if IsPedSwimmingUnderWater(cache.ped) then
                    oxygen = math.floor(GetPlayerUnderwaterTimeRemaining(PlayerId()) * 10)
                else
                    oxygen = 'not_swimming'
                end

                values.oxygen = oxygen or 'not_swimming'
                SendNUIMessage({ type = "status_update", value = values })
                Wait(250)
            end
        end)
    end
end


