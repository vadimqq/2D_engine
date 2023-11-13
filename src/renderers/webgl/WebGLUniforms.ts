const addUniform = ( container, uniformObject ) => {

	container.seq.push( uniformObject );
	container.map[ uniformObject.id ] = uniformObject;

}
const parseUniform = ( activeInfo: WebGLUniformLocation, addr: WebGLUniformLocation, container: WebGLUniforms ) => {

	const path = activeInfo.name,
		pathLength = path.length;

	// reset RegExp object, because of the early exit of a previous run
	RePathPart.lastIndex = 0;

	while ( true ) {

		const match = RePathPart.exec( path ),
			matchEnd = RePathPart.lastIndex;

		let id = match[ 1 ];
		const idIsIndex = match[ 2 ] === ']',
			subscript = match[ 3 ];

		if ( idIsIndex ) id = id | 0; // convert to integer

		if ( subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength ) {

			// bare name or "pure" bottom-level array "[0]" suffix

			addUniform( container, subscript === undefined ?
				new SingleUniform( id, activeInfo, addr ) :
				new PureArrayUniform( id, activeInfo, addr ) );

			break;

		} else {

			// step into inner node / create it in case it doesn't exist

			const map = container.map;
			let next = map[ id ];

			if ( next === undefined ) {

				next = new StructuredUniform( id );
				addUniform( container, next );

			}

			container = next;

		}

	}

}

class SingleUniform {

	constructor( id, activeInfo, addr ) {

		this.id = id;
		this.addr = addr;
		this.cache = [];
		this.setValue = getSingularSetter( activeInfo.type );

		// this.path = activeInfo.name; // DEBUG

	}

}

class PureArrayUniform {

	constructor( id, activeInfo, addr ) {

		this.id = id;
		this.addr = addr;
		this.cache = [];
		this.size = activeInfo.size;
		this.setValue = getPureArraySetter( activeInfo.type );

		// this.path = activeInfo.name; // DEBUG

	}

}

class StructuredUniform {

	constructor( id ) {

		this.id = id;

		this.seq = [];
		this.map = {};

	}

	setValue( gl, value, textures ) {

		const seq = this.seq;

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {

			const u = seq[ i ];
			u.setValue( gl, value[ u.id ], textures );

		}

	}

}

export class WebGLUniforms {
    seq = []
    map = {}
	constructor(gl: WebGL2RenderingContext, program: WebGLProgram ) {
		const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

		for (let i = 0; i < n; ++ i) {
			const info = gl.getActiveUniform(program, i) as WebGLActiveInfo;
		    const addr = gl.getUniformLocation(program, info.name) as WebGLUniformLocation;

			parseUniform(info, addr, this);

		}

	}

	setValue( gl, name, value, textures ) {

		const u = this.map[ name ];

		if ( u !== undefined ) u.setValue( gl, value, textures );

	}

	setOptional( gl, object, name ) {

		const v = object[ name ];

		if ( v !== undefined ) this.setValue( gl, name, v );

	}

	static upload( gl, seq, values, textures ) {

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {

			const u = seq[ i ],
				v = values[ u.id ];

			if ( v.needsUpdate !== false ) {

				// note: always updating when .needsUpdate is undefined
				u.setValue( gl, v.value, textures );

			}

		}

	}

	static seqWithValue( seq, values ) {

		const r = [];

		for ( let i = 0, n = seq.length; i !== n; ++ i ) {

			const u = seq[ i ];
			if ( u.id in values ) r.push( u );

		}

		return r;

	}

}