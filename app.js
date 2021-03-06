/*
 * My shitty PewPewJson compiler
 * Copyright (c) 2021 Dominykas M. (Tasty Kiwi)
 * Licensed under MIT license
 */

function compile() {
	const raw_code = document.getElementById("codearea").value
	// compile code
	try {
		let temp_arr = ["-- this level file was created by pewpewjson compiler\n"]
		// if no text, throw an exception
		if (!raw_code) {
			throw "Error: Did you forget to put something in?"
		}

		// convert json to js object
		const parsed_code = JSON.parse(raw_code)

		// convert objects into lua code
		if (parsed_code.options.use_helpers) {
			temp_arr.push(`-- use_helpers is true, which means you need helpers from sample_useful_helpers.\n`, `local player_helpers = require("/dynamic/helpers/player_helpers.lua")`, `local shield_box = require("/dynamic/helpers/boxes/shield_box.lua")`, `local cannon_box = require("/dynamic/helpers/boxes/cannon_box.lua")\n`)
		}
		if (parsed_code.options.level_size) {
			temp_arr.push(`pewpew.set_level_size(${parsed_code.options.level_size[0]}fx, ${parsed_code.options.level_size[1]}fx)`)
		}
		if (parsed_code.options.player_position && parsed_code.options.use_helpers) {
			temp_arr.push(`local ship = player_helpers.new_player_ship(${parsed_code.options.player_position[0]}fx, ${parsed_code.options.player_position[1]}fx, 0)`)
		} else if (parsed_code.options.player_position && !parsed_code.options.use_helpers) {
			temp_arr.push(`local ship = pewpew.new_player_ship(${parsed_code.options.player_position[0]}fx, ${parsed_code.options.player_position[1]}fx, 0)`)
		}
		if (parsed_code.options.shields >= 0) {
			temp_arr.push(`pewpew.configure_player(0, {shield = ${parsed_code.options.shields}})`)
		}
		if (parsed_code.options.camera_distance >= -32767) {
			temp_arr.push(`pewpew.configure_player(0, {camera_distance = ${parsed_code.options.camera_distance}fx})`)
		}
		if (parsed_code.options.camera_rotation_x_axis >= -32767) {
			temp_arr.push(`pewpew.configure_player(0, {camera_rotation_x_axis = ${parsed_code.options.camera_rotation_x_axis}fx})`)
		}
		if (parsed_code.options.move_joystick_color) {
			temp_arr.push(`pewpew.configure_player(0, {move_joystick_color = 0x${parsed_code.options.move_joystick_color}})`)
		}
		if (parsed_code.options.shoot_joystick_color) {
			temp_arr.push(`pewpew.configure_player(0, {shoot_joystick_color = 0x${parsed_code.options.shoot_joystick_color}})`)
		}
		if (parsed_code.options.cannon_type && parsed_code.options.cannon_frequency) {
			temp_arr.push(`local weapon_config = pewpew.configure_player_ship_weapon(ship, {cannon = pewpew.CannonType.${parsed_code.options.cannon_type.toUpperCase()}, frequency = pewpew.CannonFrequency.${parsed_code.options.cannon_frequency.toUpperCase()}})`)
		}

		//this oddball ensures the game ends
		temp_arr.push(`pewpew.add_update_callback(function() if pewpew.get_player_configuration(0)["has_lost"] == true then pewpew.stop_game() end end)`)
		if (parsed_code.entities) {
			for (let i = 0; i < parsed_code.entities.length; i++) {
				if (parsed_code.entities[i].entity_type.toUpperCase() == "CUSTOMIZABLE_ENTITY") {
					temp_arr.push(`pewpew.customizable_entity_set_mesh(pewpew.new_customizable_entity(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx), "/dynamic/${parsed_code.entities[i].mesh_path}", 0)`)
				}
			}
		}
		if (parsed_code.options.respawn_enemies) {
			temp_arr.push(`pewpew.add_update_callback(function() if pewpew.get_entity_count(pewpew.EntityType.MOTHERSHIP) + pewpew.get_entity_count(pewpew.EntityType.ASTEROID) + pewpew.get_entity_count(pewpew.EntityType.BAF) + pewpew.get_entity_count(pewpew.EntityType.INERTIAC) + pewpew.get_entity_count(pewpew.EntityType.ROLLING_CUBE) + pewpew.get_entity_count(pewpew.EntityType.WARY) + pewpew.get_entity_count(pewpew.EntityType.UFO) + pewpew.get_entity_count(pewpew.EntityType.CROWDER) == 0 then`)
		}
		//enemy code
		if (parsed_code.entities) {
			for (let i = 0; i < parsed_code.entities.length; i++) {
				if (parsed_code.entities[i].entity_type.toUpperCase() == "WARY") {
					temp_arr.push(`pewpew.new_wary(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx)`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "ASTEROID") {
					temp_arr.push(`pewpew.new_asteroid(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx)`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "CROWDER") {
					temp_arr.push(`pewpew.new_crowder(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx)`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "ROLLING_CUBE") {
					if (parsed_code.entities[i].wall_collisions) {
						temp_arr.push(`pewpew.rolling_cube_set_enable_collisions_with_walls(pewpew.new_rolling_cube(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx), true)`)
					} else {
						temp_arr.push(`pewpew.new_rolling_cube(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx)`)
					}
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "UFO") {
					if (parsed_code.entities[i].wall_collisions) {
						temp_arr.push(`pewpew.ufo_set_enable_collisions_with_walls(pewpew.new_ufo(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx), true)`)
					} else {
						temp_arr.push(`pewpew.new_ufo(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx)`)
					}
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "BOMB") {
					temp_arr.push(`pewpew.new_bomb(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, pewpew.BombType.${parsed_code.entities[i].bomb_type.toUpperCase()})`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "INERTIAC") {
					temp_arr.push(`pewpew.new_inertiac(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx, ${parsed_code.entities[i].attributes[3]}fx)`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "ROLLING_SPHERE") {
					temp_arr.push(`pewpew.new_rolling_sphere(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx, ${parsed_code.entities[i].attributes[3]}fx)`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "BAF") {
					temp_arr.push(`pewpew.new_baf(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx, ${parsed_code.entities[i].attributes[3]}fx, ${parsed_code.entities[i].attributes[4]})`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "BAF_BLUE") {
					temp_arr.push(`pewpew.new_baf_blue(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx, ${parsed_code.entities[i].attributes[3]}fx, ${parsed_code.entities[i].attributes[4]})`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "BAF_RED") {
					temp_arr.push(`pewpew.new_baf_red(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, ${parsed_code.entities[i].attributes[2]}fx, ${parsed_code.entities[i].attributes[3]}fx, ${parsed_code.entities[i].attributes[4]})`)
				}
				if (parsed_code.entities[i].entity_type.toUpperCase() == "MOTHERSHIP") {
					temp_arr.push(`pewpew.new_mothership(${parsed_code.entities[i].attributes[0]}fx, ${parsed_code.entities[i].attributes[1]}fx, pewpew.MothershipType.${parsed_code.entities[i].mothership_type.toUpperCase()}, ${parsed_code.entities[i].attributes[2]}fx)`)
				}
			}
		}

		if (parsed_code.options.respawn_enemies) {
			temp_arr.push(`end`, `end)`)
		}


		if (parsed_code.options.use_helpers){
			if (parsed_code.helper_extras.use_shield_box && parsed_code.helper_extras.modulo_max) {
				temp_arr.push(`local time1 = 0`, `pewpew.add_update_callback(function()`, 'time1 = time1 + 1', `local modulo1 = time1 % ${parsed_code.helper_extras.modulo_max}`, `if modulo1 == ${parsed_code.helper_extras.shield_box_modulo} then shield_box.new(fmath.random_fixedpoint(10fx, ${parsed_code.options.level_size[0]}fx - 10fx), fmath.random_fixedpoint(10fx, ${parsed_code.options.level_size[1]}fx - 10fx), weapon_config)`, `end`, `end)`)
			}
	
			if (parsed_code.helper_extras.use_cannon_box && parsed_code.helper_extras.modulo_max) {
				temp_arr.push(`local time2 = 0`, `pewpew.add_update_callback(function()`, 'time2 = time2 + 1', `local modulo2 = time2 % ${parsed_code.helper_extras.modulo_max}`, `if modulo2 == ${parsed_code.helper_extras.cannon_box_modulo} then cannon_box.new(fmath.random_fixedpoint(10fx, ${parsed_code.options.level_size[0]}fx - 10fx), fmath.random_fixedpoint(10fx, ${parsed_code.options.level_size[1]}fx - 10fx), fmath.random_int(0, 4))`, `end`, `end)`)
			}
	
		}


		// join the array of code 
		document.getElementById("codeoutput").innerHTML = temp_arr.join('\n')
	} catch (error) {
		// send error if some shit happened
		document.getElementById("codeoutput").innerHTML = `-- ${error}`
	}
	//mesh generator
	try {
		let mesh_arr = []
		if (JSON.parse(raw_code).options.level_size) {
			if (JSON.parse(raw_code).mesh_options.mesh_color) {
				mesh_arr = ["-- this mesh file was created by pewpewjson compiler\n", `meshes = {{vertexes = {{0,0}, {0,${JSON.parse(raw_code).options.level_size[1]}}, {${JSON.parse(raw_code).options.level_size[0]},${JSON.parse(raw_code).options.level_size[1]}}, {${JSON.parse(raw_code).options.level_size[0]},0}}, segments = {{0,1,2,3,0}}, colors = {0x${JSON.parse(raw_code).mesh_options.mesh_color}, 0x${JSON.parse(raw_code).mesh_options.mesh_color}, 0x${JSON.parse(raw_code).mesh_options.mesh_color}, 0x${JSON.parse(raw_code).mesh_options.mesh_color}}}}`]
			} else {
				mesh_arr = ["-- this mesh was file created by pewpewjson compiler\n", `meshes = {{vertexes = {{0,0}, {0,${JSON.parse(raw_code).options.level_size[1]}}, {${JSON.parse(raw_code).options.level_size[0]},${JSON.parse(raw_code).options.level_size[1]}}, {${JSON.parse(raw_code).options.level_size[0]},0}}, segments = {{0,1,2,3,0}}, colors = {0xffffffff, 0xffffffff, 0x$ffffffff, 0xffffffff}}}`]
			}
		} else {
			throw "Error: level_size is missing."
		}
		document.getElementById("meshoutput").innerHTML = mesh_arr.join('\n')
	} catch (error) {
		document.getElementById("meshoutput").innerHTML = `-- ${error}`
	}
}