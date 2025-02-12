function HUD:VehicleThread()
    Citizen.CreateThread(function()
        while self.inVeh do 
            local sleep = 50
            local speed = math.floor(GetEntitySpeed(self.vehicle) * 3.6)
            SendNUIMessage({ type = "update_speed", value = speed })
            if speed == 0 then sleep = 250 end
            Wait(sleep)
        end
    end)
end

function HUD:VehicleCache()
    function updateVehicleState(inVehicle)
        self.vehicle = inVehicle and GetVehiclePedIsIn(cache.ped, false) or nil
        self.inVeh = inVehicle

        if Config.RadarInVehicleOnly then 
            DisplayRadar(inVehicle)
        end

        SendNUIMessage({ type = "toggle_vehhud", value = inVehicle, toggleMinimapBorder = Config.RadarInVehicleOnly })

        if inVehicle then
            self:VehicleThread()
        else
            SendNUIMessage({ type = "update_speed", value = 0 })
        end
    end
    updateVehicleState(IsPedInAnyVehicle(cache.ped, false)) -- for people that start the resource in vehicle :>
    lib.onCache('vehicle', function(newVehicle)
        updateVehicleState(newVehicle and true or false)
    end)
    if not Config.MinimapBorder then 
        SendNUIMessage({ type = 'hide_minimap_border' })
    end 
end
