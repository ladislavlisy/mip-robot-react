import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap.css'
import mipFinder from './libs/mip/finder';
import mipRobot from './libs/mip/robot';

class Button extends Component {
    robotAction(event) {
        console.log("commad ACTION")
        return "ACTION!"
    }
    render() {
        return <button type="button" className='btn-default btn'
                       onClick={()=>{this.props.robotAction(this.props.action)}}>
            ACTION {this.props.action}
        </button>
    }
}

class RobotWrapper extends React.Component {
    constructor(props) {
        super(props)
        console.log("constructor")
        this.appFinder = new mipFinder()
        this.appRobot = mipRobot
        this.selRobot = undefined
    }
    robotAction(robotRef){
        return (function(actionNode){
            console.log("action:" + actionNode)

            console.log("robot:" + robotRef.selRobot.toString())

            robotRef.selRobot.setMipChestLedWithColor(0xff, 0x00, 0x00, 0x00, function(err) {
                console.log("commad accepted")
            })
        });
    }
    robotScan(robotRef){
        return (function(actionNode) {
            console.log("action:" + actionNode)

            robotRef.appFinder.scan(function (err, robots) {
                if (err != null) {
                    console.log(err)
                    return
                }

                //connect to first mip
                console.log("scan OK")

                robotRef.selRobot = robots[0]
                this.appFinder.connect(robotRef.selRobot, function (err) {
                    if (err != null) {
                        console.log(err)
                        return
                    }

                    console.log("connected to robot:" + robotRef.selRobot.toString())

                    var ignoreList = {"GET_STATUS": true, "GET_WEIGHT_LEVEL": true}
                    var ignore = true

                    //setup receive data notification
                    robotRef.selRobot.enableBTReceiveDataNotification(true, function (err, data) {
                        if (err) {
                            console.log(err)
                            return
                        }

                        //convert the response by MiPCommand
                        robotRef.selRobot.convertMiPResponse(data, function (command, arr) {
                            if (!ignore || ignoreList[command] === undefined || !ignoreList[command]) {
                                console.log("> " + command + ": " + arr)
                            }
                        })
                    })
                })
            })
        });
    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div className="btn-group" role="group" >
                    <Button action="scan" robotAction={this.robotScan(this)}/>
                    <Button action="01" robotAction={this.robotAction(this)}/>
                </div>
            </div>
        );
    }
}

class App extends Component {
    render() {
      return (
          <RobotWrapper/>
      );
    }
}

export default App;
