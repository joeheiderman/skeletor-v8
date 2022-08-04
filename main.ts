input.onPinPressed(TouchPin.P0, function () {
    PCA9685.reset(64)
    mode = BONES
    basic.showNumber(BONES)
    basic.clearScreen()
})
function nextBone () {
    if (list_of_bones.length > 0) {
        name_this_bone = list_of_bones._pickRandom()
        makerbit.playMp3Track(QUIZ_TOUCH_MY, QUIZ)
        basic.pause(MP3_DELAY)
        makerbit.playMp3Track(name_this_bone, BONES)
        basic.pause(MP3_DELAY)
    } else {
        basic.pause(MP3_DELAY)
        makerbit.playMp3Track(QUIZ_COMPLETE, QUIZ)
        basic.pause(MP3_DELAY)
        mode = BONES
        for (let index = 0; index < 50; index++) {
            led_control(randint(1, 12), 0)
            basic.pause(100)
            led_control(randint(1, 12), 100)
            basic.pause(100)
        }
        PCA9685.reset(64)
    }
}
input.onPinPressed(TouchPin.P2, function () {
    PCA9685.reset(64)
    makerbit.playMp3Track(QUIZ_INTRO, QUIZ)
    basic.pause(MP3_DELAY)
    mode = QUIZ
    basic.showNumber(QUIZ)
    basic.clearScreen()
    for (let index2 = 0; index2 <= 11; index2++) {
        list_of_bones.push(index2 + 1)
    }
    nextBone()
})
input.onPinPressed(TouchPin.P1, function () {
    PCA9685.reset(64)
    mode = MORE_INFO
    basic.showNumber(MORE_INFO)
    basic.clearScreen()
})
function actions (touch_point: number) {
    led_control(touch_point, LED_ON)
    if (mode == BONES || mode == MORE_INFO) {
        makerbit.playMp3Track(touch_point, mode)
        led_control(touch_point, LED_OFF)
    } else if (mode == QUIZ) {
        if (touch_point == name_this_bone) {
            makerbit.playMp3Track(QUIZ_CORRECT, QUIZ)
            basic.pause(MP3_DELAY)
            makerbit.playMp3Track(name_this_bone, BONES)
            basic.pause(MP3_DELAY)
            list_of_bones.removeAt(list_of_bones.indexOf(name_this_bone))
        } else {
            makerbit.playMp3Track(QUIZ_SORRY, QUIZ)
            basic.pause(MP3_DELAY)
            makerbit.playMp3Track(touch_point, BONES)
            basic.pause(MP3_DELAY)
            led_control(touch_point, LED_OFF)
        }
        nextBone()
    }
}
function led_control (led_num: number, led_state: number) {
    PCA9685.setLedDutyCycle(led_num, led_state, 64)
}
let name_this_bone = 0
let list_of_bones: number[] = []
let MP3_DELAY = 0
let LED_ON = 0
let LED_OFF = 0
let mode = 0
let QUIZ_COMPLETE = 0
let QUIZ_SORRY = 0
let QUIZ_CORRECT = 0
let QUIZ_TOUCH_MY = 0
let QUIZ_INTRO = 0
let QUIZ = 0
let MORE_INFO = 0
let BONES = 0
makerbit.connectSerialMp3(DigitalPin.P13, DigitalPin.P14)
PCA9685.reset(64)
pins.touchSetMode(TouchTarget.P0, TouchTargetMode.Capacitive)
pins.touchSetMode(TouchTarget.P1, TouchTargetMode.Capacitive)
pins.touchSetMode(TouchTarget.P2, TouchTargetMode.Capacitive)
BONES = 1
MORE_INFO = 2
QUIZ = 3
QUIZ_INTRO = 1
QUIZ_TOUCH_MY = 2
QUIZ_CORRECT = 3
QUIZ_SORRY = 4
QUIZ_COMPLETE = 5
mode = BONES
LED_OFF = 0
LED_ON = 75
MP3_DELAY = 400
// Monitor touch sensors T5..T16
// 
// Remap T5..T16 to 16..1
basic.forever(function () {
    if (mpr121x4.wasTouched(0)) {
        actions(mpr121x4.touchSensor(0) + 1)
    }
})
