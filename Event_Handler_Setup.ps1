# JDA - Swiss FTS - 19.09.2022
# Take in the first argument from the command line as the project name
$projectname = $args[0]
 
# Confirmation before execution
Write-Host "Running this script will setup a project with the name" -ForegroundColor Red -NoNewLine
Write-Host " '$($projectname)' " -ForegroundColor Yellow -NoNewLine
Write-Host "in the directory" -ForegroundColor Red -NoNewLine
Write-Host " '$($PSScriptRoot)' " -ForegroundColor Yellow
$resp = Read-Host "Continue? (y/n)"
if ($resp.ToLower() -ne "y") {exit}
 
# Begin setup of the project with the given project name
dotnet new sln
dotnet new classlib -o $projectname
$csproj = ".\$($projectname)\$($projectname).csproj"
dotnet sln add $csproj
 
# Replace default .csproj with SFTS event handler template
$csproj_write = @"
<Project Sdk="Microsoft.NET.Sdk">
 
  <PropertyGroup>
    <TargetFramework>net4.7.2</TargetFramework>
  </PropertyGroup>
 
  <PropertyGroup>
    <Company>Swiss FTS AG</Company>
    <AssemblyTitle>$projectname</AssemblyTitle>
    <Copyright>Copyright SFTS 2022</Copyright>
  </PropertyGroup>
 
  <ItemGroup>
    <Reference Include="kCura.EventHandler">
      <HintPath>C:\Program Files\kCura Corporation\Relativity SDK\Event Handlers\Client\kCura.EventHandler.dll</HintPath>
    </Reference>
  </ItemGroup>
 
</Project>
"@
$csproj_write | Out-File -FilePath $csproj
 
Write-Host "Script execution finished." -ForegroundColor Green