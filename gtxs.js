$(function(){


/* Auto Faker */
	if(urlParams['screen'] == 'place' && $('#unit_input_ram').length > 0){
		// We are in send troops pages

		unsafeWindow.fauto_do = function(){
			var fauto_attacks_count = parseInt(sessionStorage.fauto_attacks_count);

			var fauto_troops_ram = parseInt($('#unit_input_ram').next().html().match(/\d+/));
			var fauto_troops_cat = parseInt($('#unit_input_catapult').next().html().match(/\d+/));
			var fauto_troops_sct = parseInt($('#unit_input_spy').next().html().match(/\d+/));

			var defaults = fauto_settings(false);

			if(fauto_attacks_count <= 0 || (fauto_troops_ram < defaults[0] && fauto_troops_cat < defaults[1])){
				// Fakes count limit is reached or out of troops, stop

				if(sessionStorage.fauto_on_finish == 'n'){
					// Go to next village
					sessionStorage.fauto_attacks_count = sessionStorage.fauto_attacks_count_org;
					window.location = 'http://' + document.location.host + '/game.php?village=n' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'];
				}else{
					// Stop
					delete sessionStorage.fauto_coords;
					delete sessionStorage.fauto_send_scouts;
					delete sessionStorage.fauto_attacks_count_org;
					delete sessionStorage.fauto_attacks_count;
					delete sessionStorage.fauto_on_finish;
					$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px; background-color: #DD0000; color: #FFFFFF;">Auto fakes finished!<br>Close the tab!</div>');
				}
			}else{
				// Fakes count limit is not reached and there are still troops, continue
				sessionStorage.fauto_attacks_count = fauto_attacks_count - 1;

				if(fauto_troops_ram >= defaults[0] && defaults[0] != 0){
					$('#unit_input_ram').val(defaults[0]);
				}else{
					$('#unit_input_catapult').val(defaults[1]);
				}

				if(sessionStorage.fauto_send_scouts == 'y' && fauto_troops_sct >= defaults[2]){
					$('#unit_input_spy').val(defaults[2]);
				}

				var coords = sessionStorage.fauto_coords.split(' ');
				var coord_random = coords[Math.round(Math.random() * (coords.length - 1))];
				var coord_random_splited = coord_random.split('|');

				$('input[name=x]').val(coord_random_splited[0]);
				$('input[name=y]').val(coord_random_splited[1]);
				$('#place_target input[type=text]').val(coord_random);
				$('#target_attack').click();
			}
		}

		unsafeWindow.fauto_settings = function(do_set){
			if(do_set == true){
				var defaults = fauto_settings(false);

				var fauto_s_rams = prompt('Standard number of Rams for fakes in this world:', defaults[0]);
				if(fauto_s_rams != null){
					localStorage.fauto_s_rams = parseInt(fauto_s_rams.trim());
				}

				var fauto_s_cats = prompt('Standard number of Catapults for fakes in this world:', defaults[1]);
				if(fauto_s_cats != null){
					localStorage.fauto_s_cats = parseInt(fauto_s_cats.trim());
				}

				var fauto_s_scouts = prompt('Standard number of Scouts for fakes in this world:', defaults[2]);
				if(fauto_s_scouts != null){
					localStorage.fauto_s_scouts = parseInt(fauto_s_scouts.trim());
				}
			}else{
				var fauto_s_rams = (typeof localStorage.fauto_s_rams != 'undefined' ? localStorage.fauto_s_rams : 1);
				var fauto_s_cats = (typeof localStorage.fauto_s_cats != 'undefined' ? localStorage.fauto_s_cats : 1);
				var fauto_s_scouts = (typeof localStorage.fauto_s_scouts != 'undefined' ? localStorage.fauto_s_scouts : 4);

				return [fauto_s_rams, fauto_s_cats, fauto_s_scouts];
			}
		}

		if(typeof sessionStorage.fauto_coords == 'undefined'){
			// No auto fake is set, show auto fake button
			unsafeWindow.fauto = function(){
				var fauto_coords = prompt('Enter fake target coords.\r\nFormat: XXX|YYY XXX|YYY XXX|YYY');
				var fauto_send_scouts = prompt('Send scouts if available?\r\ny: Yes\r\nn: No', 'y');
				var fauto_attacks_count = prompt('How many fakes (limit)?', '20');
				var fauto_on_finish = prompt('What to do when no troops or fakes limit reached?\r\ns: Stop, do nothing\r\nn: Go to next village', 's');

				if(fauto_coords == null || fauto_send_scouts == null || fauto_attacks_count == null || fauto_on_finish == null){
					return;
				}

				$('#fauto_button, #fauto_s_button').attr('disabled', true);

				sessionStorage.fauto_coords = fauto_coords.trim();
				sessionStorage.fauto_send_scouts = fauto_send_scouts.trim();
				sessionStorage.fauto_attacks_count_org = fauto_attacks_count.trim();
				sessionStorage.fauto_attacks_count = fauto_attacks_count.trim();
				sessionStorage.fauto_on_finish = fauto_on_finish.trim();

				fauto_do();
			}

			$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" id="fauto_button" onclick="fauto();" value="Fakes"><br><input type="button" id="fauto_s_button" onclick="fauto_settings(true);" value="Settings" style="font-size: 7pt;"></div>');
		}else{
			// Auto fake is set, do actions
			fauto_do();
		}
	}else if(urlParams['screen'] == 'place' && urlParams['try'] == 'confirm'){
		// We are in confirm send troops pages
		if(typeof sessionStorage.fauto_coords != 'undefined'){
			$('#troop_confirm_submit').click();
		}
	}
	/* End */
	
}