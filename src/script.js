import './style.css'
import * as THREE from 'three'
import {Text, preloadFont} from 'troika-three-text'
import gsap from 'gsap'


// Fonts

preloadFont({ font: "/fonts/Brown-Font/BrownHeavy\ Regular.ttf" })


// Textures 

const loader = new THREE.TextureLoader()
let texture = loader.load('/ERRR_Cover.jpg')


// Morceaux

let morceaux = [
    "01. BELEK",
    "02. OTW",
    "03. L' APPEL",
    "04. CASTRO (feat. $ouley)",
    "05. NO HOOK",
    "06. SAOULÉ",
    "07. CRENSHAW",
    "08. RAT INTERLUDE",
    "09. ZAZA",
    "10. MAUVAIS PAYEUR",
    "11. VOIR AILLEURS (feat. Zamdane)",
    "12. BOXE INTERLUDE",
    "13. LONERRR",
    "14. VOITURE SPORTIVE",
    "15. ZOMBIE",
    "16. VVS (feat. S-Téban)",
    "17. KANYE WEST",
    "18. LYELE OUTRO"
]



// Canvas

const canvas = document.querySelector('canvas.webgl')


// Scene

const scene = new THREE.Scene()


// Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)


// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




// basic cube

var geometry = new THREE.BoxGeometry( 1.25, 5, 1.25)
var material = new THREE.MeshStandardMaterial( { color: 0x232487 } );
var cube = new THREE.Mesh ( geometry, material )
scene.add( cube )


// Plane Group

var group = new THREE.Group()
scene.add( group )


// Initialize all planeGeometries

if(window.innerWidth >= 500)
    var PlaneGeometry = new THREE.PlaneGeometry(1.5, 1.5, 16, 16)
else 
    var PlaneGeometry = new THREE.PlaneGeometry(1, 1, 16, 16)

PlaneGeometry.applyMatrix4( new THREE.Matrix4().makeTranslation(0, 0, 4) ) 
var PlaneMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }) 



for(let i = 0; i < 18; i++)
{
    var plane = new THREE.Mesh ( PlaneGeometry, PlaneMaterial )
    plane.rotation.y = (Math.PI * 2 / 3.33) * i
    plane.position.y = -(Math.PI * 2 / 3.33) * i

    group.add( plane )


    let myText = new Text()
    myText.text = morceaux[i]
    myText.font = "/fonts/Brown-Font/BrownHeavy\ Regular.ttf"
    myText.fontSize = 0.15
    myText.anchorX = "center" 
    myText.anchorY = "middle"
    myText.position.y -= .70
    myText.color = 0xffffff
    myText.fillOpacity = 0

    
    group.children[i].add(myText)
    myText.position.z = 4.1
    
    myText.sync()
}





// Resize Meshes Function

let resizeMeshes = () =>
{
    if(window.innerWidth <= 500)
        for(let i = 0; i < 18; i++)
        {   
            group.children[i].scale.x = 0.75
            group.children[i].scale.y = 0.75
        }

    else
        for(let i = 0; i < 18; i++)
        {   
            group.children[i].scale.x = 1
            group.children[i].scale.y = 1
        }
}




// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add( ambientLight )

const light = new THREE.DirectionalLight(0xffffff, 0.5)
light.position.set(0, 0, 6)
scene.add( light )


// Resize

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))    

    resizeMeshes()
    
})



// Animate

let start = 0

canvas.addEventListener('touchstart', (e) =>
{
    e.preventDefault()
    start = e.changedTouches[0].clientX
})

let end = 0
let diff = 0

canvas.addEventListener('touchmove', (e) =>
{
    e.preventDefault()

    end = e.changedTouches[0].clientX
    diff = (start - end) * 5

    start = e.changedTouches[0].clientX
})



let speed = 0

document.addEventListener('wheel', (e) =>
    speed = e.deltaY
)

let ease = 0.075

let lerp = (start, end, ease) => 
{
    return start * (1 - ease) + end * ease
}

let current = 0

let animate = () =>
{
    current = lerp(current, diff || speed, ease)


    if(group.position.y + (current * 0.004) <= 0)
    {
        current = 0
        
        cube.rotation.y = 0
        cube.scale.x = 1 
        cube.scale.y = 1       
        cube.scale.z = 1 

        group.rotation.y = 0        
        group.position.y = 0 
    }

    if(cube.rotation.y - (current * 0.0006) <= -Math.PI * 2)
        current = 0

    
    cube.rotation.y += -(current * 0.0006)
    cube.scale.x += current * 0.00002
    cube.scale.y += current * 0.00002
    cube.scale.z += current * 0.00002

    group.rotation.y += -(current * 0.004)
    group.position.y += current * 0.004



    for(let i = 0; i < 18; i++)
    {
        group.children[i].rotation.z = (group.rotation.y + group.children[i].rotation.y) ** 2 * -0.008

        if(group.rotation.y + group.children[i].rotation.y < 0.5 && group.rotation.y + group.children[i].rotation.y > -0.5)
            gsap.to(group.children[i].children, {fillOpacity: 1, duration: 1})
        else
            gsap.to(group.children[i].children, {fillOpacity: 0, duration: 1})
    }

    

    diff *= 0.6
    speed *= 0.6


    window.requestAnimationFrame(animate)
}
animate()




const tick = () =>
{
    // Render
    renderer.render(scene, camera)

    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

