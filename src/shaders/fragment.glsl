precision highp float;

uniform sampler2D uDiffuse;
uniform sampler2D uNormalMap;

varying vec2 vUv;
varying vec4 vWorldPosition;
varying vec4 vWorldNormal;

mat3 cotangent_frame(vec3 normal, vec3 p, vec2 uv, vec2 tangentSpaceParams) {
		// get edge vectors of the pixel triangle
    vec3 dp1 = dFdx(p);
    vec3 dp2 = dFdy(p);
    vec2 duv1 = dFdx(uv);
    vec2 duv2 = dFdy(uv);

		// solve the linear system
    vec3 dp2perp = cross(dp2, normal);
    vec3 dp1perp = cross(normal, dp1);
    vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
    vec3 bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

		// invert the tangent/bitangent if requested
    tangent *= tangentSpaceParams.x;
    bitangent *= tangentSpaceParams.y;

		// construct a scale-invariant frame
    float det = max(dot(tangent, tangent), dot(bitangent, bitangent));
    float invmax = det == 0.0 ? 0.0 : inversesqrt(det);
    return mat3(tangent * invmax, bitangent * invmax, normal);
}

vec3 UnpackNormal(sampler2D tex, vec2 uv) {
    vec4 normalTex = texture2D(tex, vec2(uv.x, uv.y));
    vec3 normalTs = normalTex.rgb * 2.0 - 1.0;
    return normalTs;
}

void main() {

    vec3 normal = UnpackNormal(uNormalMap, vUv);

    mat3 tbn = cotangent_frame(normalize(vWorldNormal.xyz), vWorldPosition.xyz, vUv, vec2(1., 1.));

    normal = normalize(tbn * normal);

    normal.z *= -1.;

    gl_FragColor = vec4(pow(normal, vec3(1. / 2.2)), 1.);

}