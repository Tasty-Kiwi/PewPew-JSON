/*
 * My shitty PewPewJson compiler
 * Copyright (c) 2021 Dominykas M. (Tasty Kiwi)
 * Licensed under MIT license
 */

function compile() {
	// some prep code 
	const raw_code = document.getElementById("codearea").value 
	let temp_arr = ["-- this file was created by pewpewjson compiler\n"]

	try {
		// if no text, throw an exception
		if (!raw_code) {throw "Did you forget to put something in?"}
		
		// convert json to js object
		const parsed_code = JSON.parse(raw_code)

		// convert objects into lua code
		if (parsed_code.options.level_size) {
			temp_arr.push(`pewpew.set_level_size(${parsed_code.options.level_size[0]}fx, ${parsed_code.options.level_size[1]}fx)`)
		}
		if (parsed_code.options.player_position) {
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
			temp_arr.push(`pewpew.configure_player_ship_weapon(ship, {cannon = pewpew.CannonType.${parsed_code.options.cannon_type.toUpperCase()}, frequency = pewpew.CannonFrequency.${parsed_code.options.cannon_frequency.toUpperCase()}})`)
		}

		//this oddball ensures the game ends
		temp_arr.push(`pewpew.add_update_callback(function() if pewpew.get_player_configuration(0)["has_lost"] == true then pewpew.stop_game() end end)`)
		
		if (parsed_code.options.respawn_enemies) {
			temp_arr.push(`pewpew.add_update_callback(function() if pewpew.get_entity_count(pewpew.EntityType.MOTHERSHIP) + pewpew.get_entity_count(pewpew.EntityType.ASTEROID) + pewpew.get_entity_count(pewpew.EntityType.BAF) + pewpew.get_entity_count(pewpew.EntityType.INERTIAC) + pewpew.get_entity_count(pewpew.EntityType.ROLLING_CUBE) + pewpew.get_entity_count(pewpew.EntityType.WARY) + pewpew.get_entity_count(pewpew.EntityType.UFO) + pewpew.get_entity_count(pewpew.EntityType.CROWDER) == 0 then`)
		}
		//enemy code
		let entity_array = parsed_code.entities
		for (var i = 0; i < entity_array.length; i++) {
			if (entity_array[i].entity_type.toUpperCase() == "WARY") {
				temp_arr.push(`pewpew.new_wary(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx)`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "ASTEROID") {
				temp_arr.push(`pewpew.new_asteroid(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx)`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "CROWDER") {
				temp_arr.push(`pewpew.new_crowder(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx)`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "ROLLING_CUBE") {
				if (entity_array[i].wall_collisions) {
					temp_arr.push(`pewpew.rolling_cube_set_enable_collisions_with_walls(pewpew.new_rolling_cube(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx), true)`)
				} else {
				temp_arr.push(`pewpew.new_rolling_cube(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx)`)
				}
			}
			if (entity_array[i].entity_type.toUpperCase() == "UFO") {
				if (entity_array[i].wall_collisions) {
					temp_arr.push(`pewpew.ufo_set_enable_collisions_with_walls(pewpew.new_ufo(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, ${entity_array[i].attributes[2]}fx), true)`)
				} else {
				temp_arr.push(`pewpew.new_ufo(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, ${entity_array[i].attributes[2]}fx)`)
				}
			}
			if (entity_array[i].entity_type.toUpperCase() == "BOMB") {
				temp_arr.push(`pewpew.new_bomb(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, pewpew.BombType.${entity_array[i].bomb_type.toUpperCase()})`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "INERTIAC") {
				temp_arr.push(`pewpew.new_inertiac(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, ${entity_array[i].attributes[2]}fx, ${entity_array[i].attributes[3]}fx)`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "ROLLING_SPHERE") {
				temp_arr.push(`pewpew.new_rolling_sphere(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, ${entity_array[i].attributes[2]}fx, ${entity_array[i].attributes[3]}fx)`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "BAF") {
				temp_arr.push(`pewpew.new_baf(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, ${entity_array[i].attributes[2]}fx, ${entity_array[i].attributes[3]}fx, ${entity_array[i].lifetime})`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "MOTHERSHIP") {
				temp_arr.push(`pewpew.new_mothership(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx, pewpew.MothershipType.${entity_array[i].mothership_type.toUpperCase()}, ${entity_array[i].attributes[2]}fx)`)
			}
			if (entity_array[i].entity_type.toUpperCase() == "CUSTOMIZABLE_ENTITY") {
				temp_arr.push(`pewpew.customizable_entity_set_mesh(pewpew.new_customizable_entity(${entity_array[i].attributes[0]}fx, ${entity_array[i].attributes[1]}fx), "${entity_array[i].mesh_path}", 0)`)
			}
		}
		if (parsed_code.options.respawn_enemies) {
			temp_arr.push(`end`,`end)`)
		}
		// join the array of code 
		document.getElementById("codeoutput").innerHTML = temp_arr.join('\n')
	}
	catch (error){
		// send error if some shit happened
		document.getElementById("codeoutput").innerHTML = `-- ERROR: ${error}`
	}
}