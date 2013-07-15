param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.autocomplete-textext' |
	Remove-Shims 'textext' |
	Remove-ScalejsExtension 'scalejs.autocomplete-textext' |
	Out-Null
