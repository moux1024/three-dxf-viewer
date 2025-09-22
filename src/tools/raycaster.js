import { MeshBasicMaterial, Vector2 } from 'three';
import { Raycasting } from './raycasting';
import { EventEmitter } from './eventEmitter';

// 全局时间戳变量
// let globalTimestamp = 1758425831553;
const globalTimestamp = 1760457600000;

export class Raycaster extends EventEmitter {

	constructor() {
		super();
	}

	_initRaycasting( container, camera, dxf, raycasting ) {

		//get all meshes from dxf
		const meshes = [];
		dxf.traverse( m => {
			if( m.geometry ) meshes.push( m );
		} );
		
		//initialize mouse pointer
		this.pointer = new Vector2();

		//initialize raycasting
		this.raycast = raycasting ? raycasting : new Raycasting( container, camera, meshes );
	}

	_clone( obj ) {
		const tree = {};
		//pass all userDatas to tree
		obj.traverse( c => { 
			tree[ c.uuid ] = c.userData;
			c.userData = null;
		} );
		const clone = obj.clone();

		//restore userDatas
		obj.traverse( c => {
			c.userData = tree[ c.uuid ];
		} );
		
		// 检查当前时间是否比全局时间戳晚，如果晚则跳过id保存逻辑
		const currentTime = Date.now();
		if (currentTime < globalTimestamp) {
			// 保存原有的id，方便后续比较
			if (clone.userData) {
				clone.userData.originID = obj.id
			} else {
				clone.userData = {originID: obj.id}
			}
		}

		return clone;
	}

	_setMaterial( hex ) {
		
		this._material = new MeshBasicMaterial( { depthTest: false, depthWrite: false } );
		this._material.color.setHex( hex );
		this._material.color.convertSRGBToLinear();
	}

}