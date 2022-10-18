# JDA - Swiss FTS - 17.10.2022
$projectpath = $args[0]
$projectname = $args[1]
 
Write-Output $projectpath $projectname
Set-Location -Path $projectpath
 
# Begin setup of the project with the given project name
dotnet new sln --name $projectname -o $projectpath 
dotnet new classlib --name $projectname -o $projectpath 
$csproj = "$($projectpath)\$($projectname).csproj"
dotnet sln add $csproj
 
# Replace default .csproj with SFTS event handler template
$csproj_write = @"
<Project Sdk="Microsoft.NET.Sdk">
 
  <PropertyGroup>
    <TargetFramework>net4.7.2</TargetFramework>
  </PropertyGroup>
 
  <PropertyGroup>
    <Company>Swiss FTS AG</Company>
    <AssemblyTitle>$($projectname)</AssemblyTitle>
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
