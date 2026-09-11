Add-Type -AssemblyName System.Speech

# Generate Sample 1: Female voice calling for help in distress
$synth1 = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth1.SelectVoice("Microsoft Zira Desktop")
$outPath1 = "c:\Users\user\Desktop\iit bbsr\assets\distress-voice-zira.wav"
$synth1.SetOutputToWaveFile($outPath1)
$synth1.Rate = 1
$synth1.Speak("Help! Please help me! Someone help! Leave me alone! Get away! Help! Please!")
$synth1.Dispose()

# Generate Sample 2: Male voice shouting confrontation / call for help
$synth2 = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth2.SelectVoice("Microsoft David Desktop")
$outPath2 = "c:\Users\user\Desktop\iit bbsr\assets\distress-voice-david.wav"
$synth2.SetOutputToWaveFile($outPath2)
$synth2.Rate = 1
$synth2.Speak("Hey! Stop right there! Let go! Someone call police! Help! Help!")
$synth2.Dispose()

Write-Output "Successfully generated raw voice WAV files"
