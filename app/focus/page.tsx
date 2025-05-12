"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const DEFAULT_TIMES = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function FocusPage() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.focus * 60);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [focusTime, setFocusTime] = useState(DEFAULT_TIMES.focus);
  const [shortBreakTime, setShortBreakTime] = useState(DEFAULT_TIMES.shortBreak);
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_TIMES.longBreak);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    if (mode === "focus") {
      setPomodoroCount((prev) => prev + 1);
      if (pomodoroCount % 4 === 3) {
        setMode("longBreak");
        setTimeLeft(longBreakTime * 60);
        if (autoStartBreaks) setIsRunning(true);
      } else {
        setMode("shortBreak");
        setTimeLeft(shortBreakTime * 60);
        if (autoStartBreaks) setIsRunning(true);
      }
    } else {
      setMode("focus");
      setTimeLeft(focusTime * 60);
      if (autoStartPomodoros) setIsRunning(true);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switch (mode) {
      case "focus":
        setTimeLeft(focusTime * 60);
        break;
      case "shortBreak":
        setTimeLeft(shortBreakTime * 60);
        break;
      case "longBreak":
        setTimeLeft(longBreakTime * 60);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const totalSeconds = mode === "focus" 
      ? focusTime * 60 
      : mode === "shortBreak" 
        ? shortBreakTime * 60 
        : longBreakTime * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div>
      <PageHeader 
        title="Focus" 
        description="Stay focused with the Pomodoro Technique" 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-2">
              <Button
                variant={mode === "focus" ? "default" : "outline"}
                onClick={() => {
                  setMode("focus");
                  setTimeLeft(focusTime * 60);
                  setIsRunning(false);
                }}
              >
                <Brain className="mr-2 h-4 w-4" />
                Focus
              </Button>
              <Button
                variant={mode === "shortBreak" ? "default" : "outline"}
                onClick={() => {
                  setMode("shortBreak");
                  setTimeLeft(shortBreakTime * 60);
                  setIsRunning(false);
                }}
              >
                <Coffee className="mr-2 h-4 w-4" />
                Short Break
              </Button>
              <Button
                variant={mode === "longBreak" ? "default" : "outline"}
                onClick={() => {
                  setMode("longBreak");
                  setTimeLeft(longBreakTime * 60);
                  setIsRunning(false);
                }}
              >
                <Coffee className="mr-2 h-4 w-4" />
                Long Break
              </Button>
            </div>

            <div className="text-center">
              <motion.div
                key={timeLeft}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold mb-8"
              >
                {formatTime(timeLeft)}
              </motion.div>

              <Progress value={calculateProgress()} className="mb-8" />

              <div className="flex justify-center gap-2">
                <Button size="lg" onClick={toggleTimer}>
                  {isRunning ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button size="lg" variant="outline" onClick={resetTimer}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Focus Time (minutes): {focusTime}</Label>
                <Slider
                  value={[focusTime]}
                  onValueChange={(value) => setFocusTime(value[0])}
                  min={1}
                  max={60}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Short Break (minutes): {shortBreakTime}</Label>
                <Slider
                  value={[shortBreakTime]}
                  onValueChange={(value) => setShortBreakTime(value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Long Break (minutes): {longBreakTime}</Label>
                <Slider
                  value={[longBreakTime]}
                  onValueChange={(value) => setLongBreakTime(value[0])}
                  min={1}
                  max={45}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-breaks">Auto-start Breaks</Label>
                <Switch
                  id="auto-breaks"
                  checked={autoStartBreaks}
                  onCheckedChange={setAutoStartBreaks}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-pomodoros">Auto-start Pomodoros</Label>
                <Switch
                  id="auto-pomodoros"
                  checked={autoStartPomodoros}
                  onCheckedChange={setAutoStartPomodoros}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Completed Pomodoros: {pomodoroCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}