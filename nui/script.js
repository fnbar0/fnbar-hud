let DefaultColors 

window.addEventListener('message', function (event) {
    let data = event.data;
    switch (data.type) {
        case 'status_update':
            if (data.value.oxygen === 'not_swimming') {
                $('#oxygen').css('display', 'none');
            } else {
                data.value.oxygen = Math.max(0, data.value.oxygen);
                $('#oxygen').css('display', 'block').css("--progress", `${data.value.oxygen}%`);
            }
            
            if (data.value.health !== undefined) {
                data.value.health = Math.max(0, data.value.health);
                $('#health').css("--progress", `${data.value.health}%`);
            }
            
            if (data.value.armor !== undefined) {
                (data.value.armor <= 0) ? $('#armor').css('display', 'none') : $('#armor').css('display', 'block');
                $('#armor').css("--progress", `${data.value.armor}%`);
            }
            
            if (data.value.food !== undefined) {
                data.value.food = Math.max(0, data.value.food);
                $('#food').css("--progress", `${data.value.food}%`);
            }
            
            if (data.value.drink !== undefined) {
                data.value.drink = Math.max(0, data.value.drink);
                $('#drink').css("--progress", `${data.value.drink}%`);
            }
            break;
        
        case 'voice_range':
            if (data.value !== undefined) {
                let progress = (data.value === 1) ? 50 : (data.value === 2) ? 75 : 100;
                $('#voice').css("--progress", `${progress}%`);
            }
            break;
        
        case 'voice_talking':
            if (data.value !== undefined) {
                let shadow = data.value ? 8 : 2;
                $('#voice i').css('filter', `drop-shadow(0 0 ${shadow}px var(--main))`);
            }
            break;
        
        case 'toggle':
            if (data.value !== undefined) {
                $('#hud-wrapper').css('opacity', data.value ? '1.0' : '0.0');
            }
            break;
        
        case 'update_speed':
            if (data.value !== undefined) {
                let speed = data.value;
                let percentSpeed = Math.floor((speed / 300) * 100);
                $('#veh-hud').css('--progress', percentSpeed + '%');
    
                if (speed === 0) {
                    for (let i = 0; i < 3; i++) {
                        let digitElement = $(`#digit${i + 1}`);
                        digitElement.text('0').removeClass("active").addClass("inactive");
                    }
                    return;
                }
                
                let speedStr = speed.toString().padStart(3, '0');
                let digits = speedStr.split("");
                
                for (let i = 0; i < 3; i++) {
                    let digitElement = $(`#digit${i + 1}`);
                    digitElement.text(digits[i]);
                    if (speed >= 100 || (speed >= 10 && i > 0) || i === 2) {
                        digitElement.addClass("active").removeClass("inactive");
                    } else {
                        digitElement.addClass("inactive").removeClass("active");
                    }
                }
            }
            break;
        
        case 'toggle_vehhud':
            if (data.value !== undefined) {
                if (data.value === false && data.toggleMinimapBorder) {
                    $('#minimap-border').addClass('shrink');
                }
                setTimeout(() => {
                    $('#veh-hud').css({ 'opacity': data.value ? '1.0' : '0.0', 'bottom': data.value ? '7px' : '-100px' });
                }, 300);
    
                setTimeout(() => $('#minimap-border').removeClass('shrink'), 500);
            }
            break;
        
        case 'hide_minimap_border':
            $('#minimap-border').css('display', 'none');
            break;
        
        case 'open_settings':
            $('#hud-settings').css('opacity', '1.0');
            break;
        
        case 'update_colors':
            if (data.value !== undefined) {
                $(":root").css({
                    "--main": data.value.mainColor,
                    "--secondary": data.value.secondaryColor,
                    "--background": data.value.backgroundColor
                });
                
                $('#hud-maincolor').val(data.value.mainColor);
                $('#hud-secondarycolor').val(data.value.secondaryColor);
                $('#hud-backgroundcolor').val(data.value.backgroundColor);
            }
            break;
        case 'update_default_colors':
            if (data.value !== undefined) {
                DefaultColors = data.value;
            }
            break;
    }
});

$(document).ready(function() {
    $("#hud-toggle").prop("checked", true);

    $("#hud-reset").on("click", () => {
        $(":root").css({
            "--main": DefaultColors.MainColor,
            "--secondary": DefaultColors.SecondaryColor,
            "--background": DefaultColors.BackgroundColor
        });
        $('#hud-maincolor').val(DefaultColors.MainColor);
        $('#hud-secondarycolor').val(DefaultColors.SecondaryColor);
        $('#hud-backgroundcolor').val(DefaultColors.BackgroundColor);

        $.post(`https://${GetParentResourceName()}/cacheColors`, JSON.stringify({mainColor: $("#hud-maincolor").val(), secondaryColor: $("#hud-secondarycolor").val(), backgroundColor: $("#hud-backgroundcolor").val()}));
    });

    $("#hud-settings i").on("click", function() {
        let settings = $("#hud-settings");
        settings.css('opacity', 0.0);
        $.post(`https://${GetParentResourceName()}/focusoff`);
    });

    $("#hud-toggle").on("change", function() {
        let value = $(this).prop("checked"); 
        $('#hud-wrapper').css('opacity', value ? '1.0' : '0.0');
    });

    $("#rainbow-toggle").on("change", function () {
        let value = $("#rainbow-toggle").prop("checked");
    
        let old = $("#hud-maincolor").val(); 
        let step = 0;
        let interval;
    
        if (value) {
            interval = setInterval(function () {
                let rainbowValue = setcolor(step);
                $(":root").css("--main", rainbowValue); 
                step += 1; 
                if (step > 360) step = 0; 
            }, 100);
            $(this).data("interval", interval); 
        } else {
            clearInterval($(this).data("interval")); 
            $(":root").css("--main", old);
        }
    });
        
    $("#hud-maincolor, #hud-secondarycolor, #hud-backgroundcolor").on("input", function() {
        let colorValue = $(this).val();

        if ($(this).attr("id") === "hud-maincolor") {
            $(":root").css("--main", colorValue);
        } else if ($(this).attr("id") === "hud-backgroundcolor") {
            $(":root").css("--background", colorValue); 
        }
        $.post(`https://${GetParentResourceName()}/cacheColors`, JSON.stringify({mainColor: $("#hud-maincolor").val(), secondaryColor: $("#hud-secondarycolor").val(), backgroundColor: $("#hud-backgroundcolor").val()}));
    });
});

function setcolor(degrees) {
    let color;
    degrees = degrees % 360;
    if (degrees <= 60) {
        let g = Math.floor(255 * (degrees / 60));
        color = `rgb(255, ${g}, 0)`;
    } else if (degrees <= 120) {
        let r = Math.floor(255 * ((120 - degrees) / 60));
        color = `rgb(${r}, 255, 0)`;
    } else if (degrees <= 180) {
        let b = Math.floor(255 * ((degrees - 120) / 60));
        color = `rgb(0, 255, ${b})`;
    } else if (degrees <= 240) {
        let g = Math.floor(255 * ((240 - degrees) / 60));
        color = `rgb(0, ${g}, 255)`;
    } else if (degrees <= 300) {
        let r = Math.floor(255 * ((degrees - 240) / 60));
        color = `rgb(${r}, 0, 255)`;
    } else {
        let g = Math.floor(255 * ((360 - degrees) / 60));
        color = `rgb(255, ${g}, 0)`;
    }
    return color;
}
